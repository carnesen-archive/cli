import { createLeaf } from '@alwaysai/alwayscli';

import chalk from 'chalk';
import { authenticationClient } from '../../util/authentication-client';
import { echo } from '../../util/echo';

export const userShow = createLeaf({
  name: 'show',
  description: 'Show the currently logged in user',
  options: {},
  async action() {
    if (authenticationClient.isSignedIn()) {
      echo('Not logged in');
    } else {
      const { email } = await authenticationClient.getInfo();
      echo(`Logged in as ${chalk.bold(email)}`);
    }
  },
});
