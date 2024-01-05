/* eslint-disable no-underscore-dangle */
import { Signer } from '@aws-amplify/core';
import Amplify, { Auth } from 'aws-amplify';
import 'mapbox-gl/dist/mapbox-gl.css';
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

export default async function getCoordinates(place) {
  const credentials = await Auth.currentCredentials();

  const client = new Location({
    credentials,
    region: awsconfig.aws_project_region,
  });

  const params = {
    IndexName: awsconfig.aws_geo_mapIndexName,
    MaxResults: 10,
    Text: place,
  };

  client.searchPlaceIndexForText(params, (err, data) => {
    if (err) console.error('erroe of Text', err);
    if (data.Results?.length > 0) {
      const coordinates = data.Results[0]?.Place.Geometry.Point;
      console.log('text Cordinates', data);
      return coordinates;
    }
  });
}
