import chalk from 'chalk';
import { AuthenticationDetails } from 'amazon-cognito-identity-js';
import ora = require('ora');

import { TerseError } from '@alwaysai/alwayscli';

import { instantiateUser, getCurrentUser } from '../util/cognito-auth';
import { webAuthUrl } from '../util/cli-config';
import { alwaysaiUserEmailInputComponent } from './alwaysai-user-email-input-component';
import { alwaysaiUserPasswordInputComponent } from './alwaysai-user-password-input-component';

export async function alwaysaiUserLoginComponent(props: {
  yes: boolean;
  alwaysaiUserEmail?: string;
  alwaysaiUserPassword?: string;
}) {
  const existingCognitoUser = await getCurrentUser();
  if (existingCognitoUser) {
    return existingCognitoUser;
  }

  const alwaysaiUserEmail = await alwaysaiUserEmailInputComponent({
    alwaysaiUserEmail: props.alwaysaiUserEmail,
    yes: props.yes,
  });

  const password = await alwaysaiUserPasswordInputComponent({
    alwaysaiUserPassword: props.alwaysaiUserPassword,
    yes: props.yes,
  });

  const authenticationDetails = new AuthenticationDetails({
    Username: alwaysaiUserEmail,
    Password: password,
  });

  const cognitoUser = instantiateUser(alwaysaiUserEmail);

  const spinner = ora('Authenticate').start();
  await new Promise((resolve, reject) => {
    const succeed: typeof resolve = value => {
      spinner.succeed();
      resolve(value);
    };
    const fail: typeof reject = reason => {
      spinner.fail();
      reject(reason);
    };
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess(session, userConfirmationNecessary) {
        if (userConfirmationNecessary) {
          fail(
            new TerseError(
              'Account not confirmed. Please check your inbox and follow instructions to confirm your account',
            ),
          );
        } else {
          succeed(session);
        }
      },
      onFailure(err) {
        switch (err.code) {
          case 'PasswordResetRequiredException': {
            fail(
              new TerseError(
                `Password reset required. Please visit the following URL in a web browser:\n\n  ${chalk.bold(
                  webAuthUrl,
                )}`,
              ),
            );
            break;
          }

          case 'NotAuthorizedException': {
            fail(
              new TerseError(
                `Incorrect password for ${chalk.bold(
                  alwaysaiUserEmail,
                )}. Please try again or visit the following URL to reset your password:\n\n  ${chalk.bold(
                  webAuthUrl,
                )}`,
              ),
            );
            break;
          }
          case 'UserNotFoundException': {
            fail(
              new TerseError(`User not found for email ${chalk.bold(alwaysaiUserEmail)}`),
            );
            break;
          }

          default: {
            fail(err);
          }
        }
      },
      newPasswordRequired() {
        throw new TerseError(
          `First-time login must be done on the web. Please complete the authentication process first in a web browser by visiting the following URL:\n\n  ${webAuthUrl}\n\n`,
        );
      },
      mfaRequired() {
        fail(new TerseError('Multi-factor authentication (MFA) is not yet supported'));
      },
      totpRequired() {
        fail(new TerseError('Time-based one-time password (TOTP) is not yet supported'));
      },
      mfaSetup() {
        fail(
          new TerseError('Multi-factor authentication (MFA) setup is not yet supported'),
        );
      },
      selectMFAType() {
        fail(
          new TerseError(
            'Multi-factor authentication (MFA) selection is not yet supported',
          ),
        );
      },
      customChallenge() {
        fail(new TerseError('Custom authentication challenges are not yet supported'));
      },
    });
  });

  return cognitoUser;
}
