import { Signer } from '@aws-amplify/core';
import Amplify, { Auth } from 'aws-amplify';
import Location from 'aws-sdk/clients/location';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useState } from 'react';
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

const MapSearch = (props) => {
  // const { onLocationFetched, setViewport, viewport } = props;
  const [credentials, setCredentials] = useState(null);
  const [locationtext, setLocationText] = useState('');

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

  // console.log('Amplify', Amplify);
  const searchPlace = (place) => {
    const params = {
      // IndexName: 'spirits-dev-platform-singleuseplaceindex',
      IndexName: awsconfig.aws_geo_mapIndexName,
      // IndexName: 'spirits-dev-platform-singleuseHereplaceindex',
      MaxResults: 10,
      Text: place,
    };

    client.searchPlaceIndexForText(params, (err, data) => data);
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
};

export default MapSearch;
