(global as any).fetch = require('node-fetch');
import {
  CognitoUserPool,
  CognitoUser,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';

import { userPoolId, userPoolClientId } from './cli-config';
import { credentialsStore } from './credentials-store';

const cognitoUserPool = new CognitoUserPool({
  UserPoolId: userPoolId,
  ClientId: userPoolClientId,
  Storage: credentialsStore,
});

export function getCurrentUser() {
  const cognitoUser = cognitoUserPool.getCurrentUser();
  if (!cognitoUser) {
    return undefined;
  }
  return cognitoUser;
}

export async function getBearerToken() {
  const user = await getCurrentUser();
  if (!user) {
    return undefined;
  }
  const session: CognitoUserSession = await new Promise((resolve, reject) => {
    user.getSession((err: any, val: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(val);
      }
    });
  });
  const jwt = session.getAccessToken().getJwtToken();
  return jwt;
}

export function instantiateUser(email: string) {
  const cognitoUser = new CognitoUser({
    Username: email,
    Pool: cognitoUserPool,
    Storage: credentialsStore,
  });
  cognitoUser.setAuthenticationFlowType('USER_PASSWORD_AUTH');
  return cognitoUser;
}
