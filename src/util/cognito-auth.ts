(global as any).fetch = require('node-fetch');
import {
  CognitoUserPool,
  CognitoUser,
  CognitoUserSession,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';
import chalk from 'chalk';

import { userPoolId, userPoolClientId, webAuthUrl } from './cli-config';
import { credentialsStore } from './credentials-store';
import { TerseError } from '@alwaysai/alwayscli';

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

export async function authenticateUser(email: string, password: string) {
  const authenticationDetails = new AuthenticationDetails({
    Username: email,
    Password: password,
  });

  const cognitoUser = instantiateUser(email);

  await new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess(_, userConfirmationNecessary) {
        if (userConfirmationNecessary) {
          reject(
            new TerseError(
              'Account not confirmed. Please check your inbox and follow instructions to confirm your account',
            ),
          );
        } else {
          resolve();
        }
      },
      onFailure(err) {
        switch (err.code) {
          case 'PasswordResetRequiredException': {
            reject(
              new TerseError(
                `Password reset required. Please visit the following URL in a web browser:\n\n  ${chalk.bold(
                  webAuthUrl,
                )}`,
              ),
            );
            break;
          }

          case 'NotAuthorizedException': {
            reject(
              new TerseError(
                `Incorrect password for ${chalk.bold(
                  email,
                )}. Please try again or visit the following URL to reset your password:\n\n  ${chalk.bold(
                  webAuthUrl,
                )}`,
              ),
            );
            break;
          }
          case 'UserNotFoundException': {
            reject(new TerseError(`User not found for email ${chalk.bold(email)}`));
            break;
          }

          default: {
            reject(err);
          }
        }
      },
      newPasswordRequired() {
        throw new TerseError(
          `First-time login must be done on the web. Please complete the authentication process first in a web browser by visiting the following URL:\n\n  ${webAuthUrl}\n\n`,
        );
      },
      mfaRequired() {
        reject(new TerseError('Multi-factor authentication (MFA) is not yet supported'));
      },
      totpRequired() {
        reject(
          new TerseError('Time-based one-time password (TOTP) is not yet supported'),
        );
      },
      mfaSetup() {
        reject(
          new TerseError('Multi-factor authentication (MFA) setup is not yet supported'),
        );
      },
      selectMFAType() {
        reject(
          new TerseError(
            'Multi-factor authentication (MFA) selection is not yet supported',
          ),
        );
      },
      customChallenge() {
        reject(new TerseError('Custom authentication challenges are not yet supported'));
      },
    });
  });

  return cognitoUser;
}
