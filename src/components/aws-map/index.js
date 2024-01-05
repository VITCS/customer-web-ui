import { Signer } from '@aws-amplify/core';
import { Button, Image, Input, Stack, useToast } from '@chakra-ui/react';
import Amplify, { Auth } from 'aws-amplify';
import Location from 'aws-sdk/clients/location';
import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useEffect, useState } from 'react';
import { FaSearchLocation } from 'react-icons/fa';
import ReactMapGL, { Marker, NavigationControl } from 'react-map-gl';
import awsconfig from '../../aws-exports';

// const mapName = 'spirits-dev-platform-map';
const mapName = awsconfig.aws_geo_mapName;
Amplify.configure(awsconfig);
const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;
/**
 * Sign requests made by Mapbox GL using AWS SigV4.todo
 */

const SIZE = 20;
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

const Awsmap = (props) => {
  const toast = useToast();
  const { onLocationFetched, setViewport, viewport, showSearch } = props;
  const [credentials, setCredentials] = useState(null);
  const [locationtext, setLocationText] = useState('');
  // const [viewport, setViewport] = useState({
  //   longitude: -74.871826,
  //   latitude: 39.833851,
  //   zoom: 10,
  // });

  const [client, setClient] = useState(null);
  // const geojson = {
  //   type: 'FeatureCollection',
  //   features: [
  //     {
  //       type: 'Feature',
  //       geometry: {
  //         type: 'Point',
  //         coordinates: [viewport.longitude, viewport.latitude],
  //       },
  //     },
  //   ],
  // };

  // const layerStyle = {
  //   id: 'point',
  //   type: 'circle',
  //   paint: {
  //     'circle-radius': viewport.zoom * 4,
  //     'circle-stroke-color': '#fb6866',
  //     'circle-stroke-width': 1.5,
  //     'circle-opacity': 0.3,
  //   },
  // };
  useEffect(() => {
    const fetchCredentials = async () => {
      console.log('auth cerdentials', await Auth.currentUserCredentials());
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

    createClient();
  }, []);
  // console.log('Amplify', Amplify);
  const searchPlace = (place) => {
    const params = {
      // IndexName: 'spirits-dev-platform-singleuseplaceindex',
      IndexName: awsconfig.aws_geo_mapIndexName,
      // IndexName: 'spirits-dev-platform-singleuseHereplaceindex',
      MaxResults: 10,
      Text: place,
    };

    client.searchPlaceIndexForText(params, (err, data) => {
      if (err) console.error('erroe of Text', err);
      if (data.Results?.length > 0) {
        const coordinates = data.Results[0]?.Place.Geometry.Point;
        console.log('text Cordinates', data);
        onLocationFetched(data);
        setViewport({
          longitude: coordinates[0],
          latitude: coordinates[1],
          zoom: 10,
        });
        return coordinates;
      }
      toast({
        title: 'info',
        description: 'Please enter Valid address',
        status: 'info',
        isClosable: true,
        duration: 3000,
      });
    });
  };
  const searchCoordinates = (place) => {
    if (!client) return null;
    const params = {
      // IndexName: 'spirits-dev-platform-singleuseplaceindex',
      // IndexName: 'spirits-dev-platform-singleuseHereplaceindex',
      IndexName: awsconfig.aws_geo_mapIndexName,
      Position: place,
      MaxResults: 10,
    };

    client.searchPlaceIndexForPosition(params, (err, data) => {
      if (err) console.error('erroe of position', err);
      if (data && data.Results?.length > 0) {
        // const placesText = data.Results[0].Place.Label;
        // console.log('placetext >>', placesText);
        // setLocationText(placesText);
        // onLocationFetched(data);
        // console.log('location', data);
        // console.log('data', data);
        // setViewport({
        //   longitude: coordinates[0],
        //   latitude: coordinates[1],
        //   zoom: 10,
        // });
        // return coordinates;
      }
    });
  };

  return (
    <div style={{ marginTop: 16 }}>
      {/* <div>
        <Search searchPlace={searchPlace} />
      </div> */}
      {credentials ? (
        <ReactMapGL
          {...viewport}
          width="100%"
          height="300px"
          transformRequest={transformRequest(credentials)}
          mapStyle={mapName}
          onViewportChange={(data) => {
            // console.log('coordinates', data);
            setViewport(data);
            // searchCoordinates([]);
          }}
          onInteractionStateChange={(doc) => {
            // console.log('documnet', doc);
            if (!doc.isDragging && !doc.isPanning) {
              // searchCoordinates([viewport.longitude, viewport.latitude]);
            }
          }}
        >
          {/* <Source id="my-data" type="geojson" data={geojson}>
            <Layer {...layerStyle} />
          </Source> */}
          {showSearch ? (
            <Stack direction="row" alignItems="center" ml={16} mt="4" px={2}>
              <Input
                variant="filled"
                value={locationtext}
                placeholder="Enter a Location"
                onChange={(e) => {
                  setLocationText(e.target.value);
                }}
                bg="white"
              />
              <Button
                icon="search"
                // as={FaSearchLocation}
                p={3}
                // isLoading={initLoading}
                // type="submit"
                // colorScheme="blue"
                onClick={() => {
                  searchPlace(locationtext);
                }}
              >
                <FaSearchLocation />
                {/* Search */}
              </Button>
            </Stack>
          ) : null}
          <Marker
            latitude={viewport.latitude}
            longitude={viewport.longitude}
            offsetLeft={-20}
            offsetTop={-10}
          >
            {/* <svg
              height={SIZE}
              viewBox="0 0 24 24"
              style={{
                cursor: 'pointer',
                fill: '#d00',
                stroke: 'none',
                transform: `translate(${-SIZE / 2}px,${-SIZE}px)`,
              }}
            >
              <path d={ICON} />
            </svg> */}
            <Image src={require('../../assets/Icon.png')} height="30px" />
          </Marker>

          <div style={{ position: 'absolute', padding: 20 }}>
            {/* react-map-gl v5 doesn't support dragging the compass to change bearing */}
            <NavigationControl showCompass={false} />
          </div>
        </ReactMapGL>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
};

export default Awsmap;
