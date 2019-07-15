import { createLeaf } from '@alwaysai/alwayscli';
import { credentialsStore } from '../../util/credentials-store';

export const userLogout = createLeaf({
  name: 'logout',
  description: 'Log out of the alwaysAI Cloud',
  options: {},
  async action() {
    try {
      await credentialsStore.clear();
      return 'Logged out successfully';
    } catch {
      return 'An error occurred logging out';
    }
  },
});
