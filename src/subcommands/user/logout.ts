import { createLeaf } from '@alwaysai/alwayscli';
import { authenticationClient } from '../../util/authentication-client';

export const userLogout = createLeaf({
  name: 'logout',
  description: 'Log out of the alwaysAI Cloud',
  options: {},
  async action() {
    try {
      await authenticationClient.signOut();
      return 'Logged out successfully';
    } catch {
      return 'An error occurred logging out';
    }
  },
});
