/* eslint-disable no-underscore-dangle */
import { Signer } from '@aws-amplify/core';
import { Image } from '@chakra-ui/react';
import Amplify, { Auth } from 'aws-amplify';
import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useEffect, useState } from 'react';
import ReactMapGL, { Marker, NavigationControl } from 'react-map-gl';
import awsconfig from '../../aws-exports';

const mapName = awsconfig.aws_geo_mapName;

Amplify.configure(awsconfig);
/**
 * Sign requests made by Mapbox GL using AWS SigV4.todo
 */
const transformRequest = (credentials) => (url, resourceType) => {
  // Resolve to an AWS URL
  if (resourceType === 'Style' && !url?.includes('://')) {
    url = `https://maps.geo.${awsconfig.aws_project_region}.amazonaws.com/maps/v0/maps/${url}/style-descriptor`;
  }

  // Only sign AWS requests (with the signature as part of the query string)
  if (url?.includes('amazonaws.com')) {
    return {
      url: Signer.signUrl(url, {
        access_key: credentials.accessKeyId,
        secret_key: credentials.secretAccessKey,
        session_token: credentials.sessionToken,
      }),
    };
  }

  // Don't sign
  return { url: url || '' };
};

const StoreLocatorMap = (props) => {
  const { onLocationFetched, coordiantes = [] } = props;
  const [credentials, setCredentials] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [viewport, setViewport] = useState({
    longitude: -74.871826,
    latitude: 39.833851,
    zoom: 10,
  });

  useEffect(() => {
    if (coordiantes?.length > 0) {
      // if (coordiantes?.length > 1) {
      //   const coords = coordiantes.map((c) => [c.longitude, c.latitude]);
      //   const [minLng, minLat, maxLng, maxLat] = bbox(lineString(coords));
      //   console.log('coorddd>>', minLat, minLng, maxLng, maxLat);
      //   // const vp = new WebMercatorViewport(viewport);

      //   // const { longitude, latitude, zoom } = vp.fitBounds(
      //   //   [
      //   //     [minLng, minLat],
      //   //     [maxLng, maxLat],
      //   //   ],
      //   //   {
      //   //     padding: 40,
      //   //   },
      //   // );

      //   // setViewport({
      //   //   // ...viewport,
      //   //   longitude,
      //   //   latitude,
      //   //   zoom,
      //   //   transitionDuration: 5000,
      //   //   transitionInterpolator: new FlyToInterpolator(),
      //   //   // transitionEasing: d3.easeCubic
      //   // });
      // }
      //  else
      //  {
      const doc = coordiantes.filter((i) => i.selected === true);
      console.log('logiing', doc);
      if (doc.length > 0) {
        console.log('Doccc', doc);
        setViewport({
          latitude: doc[0].latitude,
          longitude: doc[0].longitude,
          zoom: 15,
        });
      } else {
        setViewport({
          latitude: coordiantes[0].latitude,
          longitude: coordiantes[0].longitude,
          zoom: 3,
        });
      }
      // }
    }
  }, [coordiantes]);

  const [client, setClient] = useState(null);
  useEffect(() => {
    const fetchCredentials = async () => {
      setCredentials(await Auth.currentUserCredentials());
    };

    fetchCredentials();

    const createClient = async () => {
      const credentials = await Auth.currentCredentials();
      const client = new Location({
        credentials,
        region: awsconfig.aws_project_region,
      });
      setClient(client);
    };

    // createClient();
  }, []);

  return (
    <div style={{ marginTop: 16 }}>
      {credentials ? (
        <ReactMapGL
          {...viewport}
          // {...{ latitude, longitude, zoom }}
          width="100%"
          height="600px"
          transformRequest={transformRequest(credentials)}
          mapStyle={mapName}
          onViewportChange={(data) => {
            setViewport(data);
          }}
          onClick={(e) => console.log('e > ', e)}
        >
          {coordiantes?.map((coord) => (
            <Marker
              key={coord.id}
              latitude={coord.latitude}
              longitude={coord.longitude}
            >
              <Image
                src={require('../../assets/Icon.png')}
                opacity={coord?.selected ? 1 : 0.35}
                width={30}
                height={30}
              />
            </Marker>
          ))}

          <div style={{ position: 'absolute', padding: 10 }}>
            <NavigationControl showCompass={false} />
          </div>
        </ReactMapGL>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
};

export default StoreLocatorMap;
