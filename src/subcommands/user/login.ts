import chalk from 'chalk';
import { createLeaf } from '@alwaysai/alwayscli';

import { getCurrentUser } from '../../util/cognito-auth';
import { alwaysaiUserEmailCliInput } from '../../cli-inputs/alwaysai-user-email-cli-input';
import { alwaysaiUserPasswordCliInput } from '../../cli-inputs/alwaysai-user-password-cli-input';
import { yesCliInput } from '../../cli-inputs/yes-cli-input';
import { alwaysaiUserLoginComponent } from '../../components/alwaysai-user-login-component';

export const userLogin = createLeaf({
  name: 'login',
  description: 'Log in to the alwaysAI Cloud',
  options: {
    email: alwaysaiUserEmailCliInput,
    password: alwaysaiUserPasswordCliInput,
    yes: yesCliInput,
  },
  async action(_, opts) {
    let cognitoUser = await getCurrentUser();
    if (cognitoUser) {
      throw `Already logged in as ${chalk.bold(cognitoUser.getUsername())}`;
    }
    cognitoUser = await alwaysaiUserLoginComponent(opts);
    return `Logged in as ${chalk.bold(cognitoUser.getUsername())}`;
  },
});
