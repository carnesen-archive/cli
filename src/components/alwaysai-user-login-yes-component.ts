import { CliTerseError } from '@alwaysai/alwayscli';
import { SystemDomainName } from '@alwaysai/cloud-api';

import chalk from 'chalk';
import { PLEASE_REPORT_THIS_ERROR_MESSAGE } from '../constants';
import { Spinner } from '../util/spinner';
import { getSystemId } from '../util/system-id';
import { CliAuthenticationClient } from '../util/authentication-client';

export async function alwaysaiUserLoginYesComponent(props: {
  alwaysaiUserEmail: string;
  alwaysaiUserPassword: string;
}) {
  const { alwaysaiUserEmail, alwaysaiUserPassword } = props;
  const boldEmail = chalk.bold(alwaysaiUserEmail);
  const webAuthUrl = chalk.bold(
    `https://dashboard.${SystemDomainName(getSystemId())}/auth`,
  );
  const spinner = Spinner(`Log in ${props.alwaysaiUserEmail}`);
  try {
    const { authenticationState } = await CliAuthenticationClient().signIn(
      alwaysaiUserEmail,
      alwaysaiUserPassword,
    );

    switch (authenticationState) {
      case 'AUTHENTICATED': {
        spinner.succeed();
        break;
      }

      case 'PASSWORD_RESET_REQUIRED': {
        throw new CliTerseError(
          `Password reset required. Please visit the following URL in a web browser:\n\n  ${webAuthUrl}`,
        );
      }

      case 'NON_TEMPORARY_PASSWORD_REQUIRED': {
        throw new CliTerseError(
          `First-time login must be done on the web. Please complete the authentication process first in a web browser by visiting the following URL:\n\n  ${webAuthUrl}\n\n`,
        );
      }

      case 'USER_CONFIRMATION_REQUIRED': {
        throw new CliTerseError(
          'Account not confirmed. Please check your inbox and follow instructions to confirm your account',
        );
      }

      case 'INVALID_PASSWORD':
      case 'INCORRECT_PASSWORD': {
        throw new CliTerseError(
          `Incorrect password for ${boldEmail}. Please try again or visit the following URL to reset your password:\n\n  ${webAuthUrl}`,
        );
      }

      case 'USER_NOT_FOUND': {
        throw new CliTerseError(`User not found for email ${boldEmail}`);
      }

      case 'CUSTOM_CHALLENGE':
      case 'MFA_REQUIRED':
      case 'MFA_SETUP':
      case 'TOTP_REQUIRED':
      case 'SELECT_MFA_TYPE': {
        throw new CliTerseError(
          `Authentication client responded with authentication state "${authenticationState}". ${PLEASE_REPORT_THIS_ERROR_MESSAGE}`,
        );
      }

      default: {
        throw new CliTerseError(
          `Unexpected authentication state "${authenticationState}". ${PLEASE_REPORT_THIS_ERROR_MESSAGE}`,
        );
      }
    }
  } catch (exception) {
    spinner.fail();
    throw exception;
  }
}
