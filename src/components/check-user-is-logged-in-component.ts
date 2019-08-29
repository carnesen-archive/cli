import { alwaysaiUserPromptedLoginComponent } from './alwaysai-user-prompted-login-component';
import { getMaybeCurrentUser } from '../util/cognito-auth';
import { TerseError } from '@alwaysai/alwayscli';
import { echo } from '../util/echo';
import logSymbols = require('log-symbols');

const YOU_MUST_BE_LOGGED_IN = 'You must be logged in to run this command.';

export async function checkUserIsLoggedInComponent(props: { yes: boolean }) {
  const { yes } = props;
  const cognitoUser = getMaybeCurrentUser();
  if (!cognitoUser) {
    if (yes) {
      throw new TerseError(
        `${YOU_MUST_BE_LOGGED_IN} Please either re-run this command without the "yes" flag, or run "alwaysai user login" and try again.`,
      );
    } else {
      echo(`${logSymbols.warning} ${YOU_MUST_BE_LOGGED_IN}`);
      await alwaysaiUserPromptedLoginComponent();
    }
  }
}
