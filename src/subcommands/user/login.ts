import chalk from 'chalk';
import logSymbols = require('log-symbols');
import { AuthenticationDetails } from 'amazon-cognito-identity-js';
import { createLeaf, TerseError } from '@alwaysai/alwayscli';

import { getCurrentUser, instantiateUser } from '../../cognito-auth';
import { email, promptForEmail } from '../../inputs/email';
import { password, promptForPassword } from '../../inputs/password';
import { yes } from '../../inputs/yes';
import { promptForNewPassword } from './prompt-for-new-password';
import { echo } from '../../util/echo';
import { webAuthUrl } from '../../config/cli-config';

export const userLogin = createLeaf({
  name: 'login',
  description: 'Log in to the alwaysAI Cloud',
  options: {
    email,
    password,
    yes,
  },
  async action(_, opts) {
    {
      const cognitoUser = await getCurrentUser();
      if (cognitoUser) {
        throw new TerseError(
          `Already logged in as ${chalk.bold(cognitoUser.getUsername())}`,
        );
      }
    }

    const email = opts.email || (await promptForEmail());
    const password = opts.password || (await promptForPassword());
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    const cognitoUser = instantiateUser(email);
    cognitoUser.setAuthenticationFlowType('USER_PASSWORD_AUTH');

    await new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess(session, userConfirmationNecessary) {
          if (userConfirmationNecessary) {
            reject(
              new TerseError(
                'Account not confirmed. Please check your inbox and follow instructions to confirm your account',
              ),
            );
          } else {
            resolve(session);
          }
        },
        onFailure(err) {
          switch (err.code) {
            case 'PasswordResetRequiredException': {
              echo(
                `Please visit the following URL in a web browser to reset your password:`,
              );
              echo();
              echo(chalk.bold(webAuthUrl));
              echo();
              reject(new TerseError('Unable to proceed until password is reset'));
              break;
            }

            case 'NotAuthorizedException': {
              echo(`${logSymbols.error} Incorrect password for ${chalk.bold(email)}`);
              echo();
              echo('Please try again or visit the following URL to reset your password:');
              echo();
              echo(chalk.bold(webAuthUrl));
              echo();
              reject(new TerseError('Authentication failed'));
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
        newPasswordRequired(userAttributes) {
          promptForNewPassword(opts.yes)
            .then(newPassword => {
              // the api doesn't accept this field back
              delete userAttributes.email_verified;
              cognitoUser.completeNewPasswordChallenge(newPassword, userAttributes, {
                onSuccess() {
                  resolve();
                },
                onFailure(ex) {
                  reject(ex);
                },
              });
            })
            .catch(reject);
        },
        mfaRequired() {
          reject(
            new TerseError('Multi-factor authentication (MFA) is not yet supported'),
          );
        },
        totpRequired() {
          reject(
            new TerseError('Time-based one-time password (TOTP) is not yet supported'),
          );
        },
        mfaSetup() {
          reject(
            new TerseError(
              'Multi-factor authentication (MFA) setup is not yet supported',
            ),
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
          reject(
            new TerseError('Custom authentication challenges are not yet supported'),
          );
        },
      });
    });
    return `Logged in as ${chalk.bold(cognitoUser.getUsername())}`;
  },
});
