import { TerseError } from '@alwaysai/alwayscli';
import logSymbols = require('log-symbols');

import { alwaysaiUserLoginPromptComponent } from './alwaysai-user-login-prompt-component';
import { echo } from '../util/echo';
import { authenticationClient } from '../util/authentication-client';

const YOU_MUST_BE_LOGGED_IN = 'You must be logged in to run this command.';

export async function checkUserIsLoggedInComponent(props: { yes: boolean }) {
  const { yes } = props;
  if (!authenticationClient.isSignedIn()) {
    if (yes) {
      throw new TerseError(
        `${YOU_MUST_BE_LOGGED_IN} Please either re-run this command without the "yes" flag, or run "alwaysai user login" and try again.`,
      );
    } else {
      echo(`${logSymbols.warning} ${YOU_MUST_BE_LOGGED_IN}`);
      await alwaysaiUserLoginPromptComponent();
    }
  }
}
