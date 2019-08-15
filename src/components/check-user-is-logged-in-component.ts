import ora = require('ora');

import { alwaysaiUserPromptedLoginComponent } from './alwaysai-user-prompted-login-component';
import { getMaybeCurrentUser } from '../util/cognito-auth';
import { TerseError } from '@alwaysai/alwayscli';

export async function checkUserIsLoggedInComponent(props: { yes: boolean }) {
  const { yes } = props;
  const spinner = ora('Check user is logged in').start();
  const cognitoUser = await getMaybeCurrentUser();
  if (!cognitoUser) {
    if (yes) {
      spinner.fail();
      throw new TerseError(
        'Authentication required. Please either re-run this command without the "yes" flag, or run "alwaysai user login" and try again.',
      );
    } else {
      spinner.warn();
      await alwaysaiUserPromptedLoginComponent();
    }
  } else {
    spinner.succeed();
  }
}
