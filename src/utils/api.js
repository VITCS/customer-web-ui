import { API, Auth } from 'aws-amplify';
import awsExports from '../aws-exports';

export const graphql = async (operation) => {
  let token;
  try {
    token = (await Auth.currentSession()).idToken.jwtToken;
  } catch (error) {
    console.log('error in graphql', error);
  }
  const options =
    token?.length > 0
      ? {
          Authorization: token,
        }
      : {
          authMode: 'API_KEY',
          authToken: awsExports.aws_appsync_apiKey,
        };

  return API.graphql({
    ...operation,
    ...options,
  });
};

export const NOOP = 'VALUE';
