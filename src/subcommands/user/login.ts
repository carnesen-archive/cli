import chalk from 'chalk';
import { createLeaf, UsageError } from '@alwaysai/alwayscli';

import { getMaybeCurrentUser } from '../../util/cognito-auth';
import { alwaysaiUserEmailCliInput } from '../../cli-inputs/alwaysai-user-email-cli-input';
import { alwaysaiUserPasswordCliInput } from '../../cli-inputs/alwaysai-user-password-cli-input';
import { yesCliInput } from '../../cli-inputs/yes-cli-input';
import { alwaysaiUserPromptedLoginComponent } from '../../components/alwaysai-user-prompted-login-component';
import { RequiredWithYesMessage } from '../../util/required-with-yes-message';
import { alwaysaiUserLoginComponent } from '../../components/alwaysai-user-login-component';
import { echo } from '../../util/echo';

export const userLogin = createLeaf({
  name: 'login',
  description: 'Log in to the alwaysAI Cloud',
  options: {
    yes: yesCliInput,
    email: alwaysaiUserEmailCliInput,
    password: alwaysaiUserPasswordCliInput,
  },
  async action(_, { yes, email, password }) {
    if (yes) {
      if (!email || !password) {
        throw new UsageError(RequiredWithYesMessage('email', 'password'));
      }
      await alwaysaiUserLoginComponent({
        alwaysaiUserEmail: email,
        alwaysaiUserPassword: password,
      });
    } else {
      const cognitoUser = await getMaybeCurrentUser();
      if (cognitoUser) {
        echo(`Already logged in as ${chalk.bold(cognitoUser.getUsername())}`);
      } else {
        await alwaysaiUserPromptedLoginComponent({
          alwaysaiUserEmail: email,
          alwaysaiUserPassword: password,
        });
      }
    }
  },
});
