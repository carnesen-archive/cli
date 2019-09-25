import chalk from 'chalk';
import { createLeaf, UsageError } from '@alwaysai/alwayscli';

import { alwaysaiUserEmailCliInput } from '../../cli-inputs/alwaysai-user-email-cli-input';
import { alwaysaiUserPasswordCliInput } from '../../cli-inputs/alwaysai-user-password-cli-input';
import { yesCliInput } from '../../cli-inputs/yes-cli-input';
import { alwaysaiUserLoginPromptComponent } from '../../components/alwaysai-user-login-prompt-component';
import { RequiredWithYesMessage } from '../../util/required-with-yes-message';
import { alwaysaiUserLoginYesComponent } from '../../components/alwaysai-user-login-yes-component';
import { echo } from '../../util/echo';
import { authenticationClient } from '../../util/authentication-client';

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
      await alwaysaiUserLoginYesComponent({
        alwaysaiUserEmail: email,
        alwaysaiUserPassword: password,
      });
    } else {
      if (authenticationClient.isSignedIn()) {
        const { email } = await authenticationClient.getInfo();
        echo(`Already logged in as ${chalk.bold(email)}`);
      } else {
        await alwaysaiUserLoginPromptComponent({
          alwaysaiUserEmail: email,
          alwaysaiUserPassword: password,
        });
      }
    }
  },
});
