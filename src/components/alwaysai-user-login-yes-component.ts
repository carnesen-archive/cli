import ora = require('ora');
import { TerseError } from '@alwaysai/alwayscli';
import { SystemDomainName } from '@alwaysai/cloud-api';

import { authenticationClient } from '../util/authentication-client';
import { systemId } from '../util/cli-config';
import chalk from 'chalk';
import { PLEASE_REPORT_THIS_ERROR_MESSAGE } from '../constants';

const webAuthUrl = chalk.bold(`https://dashboard.${SystemDomainName(systemId)}/auth`);

export async function alwaysaiUserLoginYesComponent(props: {
  alwaysaiUserEmail: string;
  alwaysaiUserPassword: string;
}) {
  const { alwaysaiUserEmail, alwaysaiUserPassword } = props;
  const boldEmail = chalk.bold(alwaysaiUserEmail);
  const spinner = ora(`Log in ${props.alwaysaiUserEmail}`).start();
  try {
    const { authenticationState } = await authenticationClient.signIn(
      alwaysaiUserEmail,
      alwaysaiUserPassword,
    );

    switch (authenticationState) {
      case 'AUTHENTICATED': {
        spinner.succeed();
        break;
      }

      case 'PASSWORD_RESET_REQUIRED': {
        throw new TerseError(
          `Password reset required. Please visit the following URL in a web browser:\n\n  ${webAuthUrl}`,
        );
      }

      case 'NON_TEMPORARY_PASSWORD_REQUIRED': {
        throw new TerseError(
          `First-time login must be done on the web. Please complete the authentication process first in a web browser by visiting the following URL:\n\n  ${webAuthUrl}\n\n`,
        );
      }

      case 'USER_CONFIRMATION_REQUIRED': {
        throw new TerseError(
          'Account not confirmed. Please check your inbox and follow instructions to confirm your account',
        );
      }

      case 'INVALID_PASSWORD':
      case 'INCORRECT_PASSWORD': {
        throw new TerseError(
          `Incorrect password for ${boldEmail}. Please try again or visit the following URL to reset your password:\n\n  ${webAuthUrl}`,
        );
      }

      case 'USER_NOT_FOUND': {
        throw new TerseError(`User not found for email ${boldEmail}`);
      }

      case 'CUSTOM_CHALLENGE':
      case 'MFA_REQUIRED':
      case 'MFA_SETUP':
      case 'TOTP_REQUIRED':
      case 'SELECT_MFA_TYPE': {
        throw new TerseError(
          `Authentication client responded with authentication state "${authenticationState}". ${PLEASE_REPORT_THIS_ERROR_MESSAGE}`,
        );
      }

      default: {
        throw new TerseError(
          `Unexpected authentication state "${authenticationState}". ${PLEASE_REPORT_THIS_ERROR_MESSAGE}`,
        );
      }
    }
  } catch (exception) {
    spinner.fail();
    throw exception;
  }
}
