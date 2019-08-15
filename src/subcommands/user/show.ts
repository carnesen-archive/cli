import { createLeaf } from '@alwaysai/alwayscli';

import { getMaybeCurrentUser } from '../../util/cognito-auth';
import chalk from 'chalk';

export const userShow = createLeaf({
  name: 'show',
  description: 'Show the currently logged in user',
  options: {},
  async action() {
    const user = await getMaybeCurrentUser();
    return user ? `Logged in as ${chalk.bold(user.getUsername())}` : 'Not logged in';
  },
});
