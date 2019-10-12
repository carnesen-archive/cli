import { CliLeaf } from '@alwaysai/alwayscli';

import chalk from 'chalk';
import { CliAuthenticationClient } from '../../util/authentication-client';
import { echo } from '../../util/echo';

export const userShow = CliLeaf({
  name: 'show',
  description: 'Show the currently logged in user',
  async action() {
    const authenticationClient = CliAuthenticationClient();
    if (authenticationClient.isSignedIn()) {
      const { email } = await authenticationClient.getInfo();
      echo(`Logged in as ${chalk.bold(email)}`);
    } else {
      echo('Not logged in');
    }
  },
});
