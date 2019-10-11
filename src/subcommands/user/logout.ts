import { CliLeaf } from '@alwaysai/alwayscli';
import { CliAuthenticationClient } from '../../util/authentication-client';

export const userLogout = CliLeaf({
  name: 'logout',
  description: 'Log out of the alwaysAI Cloud',
  async action() {
    try {
      CliAuthenticationClient().signOut();
      return 'Logged out successfully';
    } catch {
      return 'An error occurred logging out';
    }
  },
});
