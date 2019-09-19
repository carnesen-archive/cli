import { createLeaf, createFlagInput } from '@alwaysai/alwayscli';

import { underscoreTestStarterAppsComponent } from '../../components/underscore-test-starter-apps-component';
import { targetHostnameCliInput } from '../../cli-inputs/target-hostname-cli-input';

export const appInstallCliLeaf = createLeaf({
  name: '_test-starter-apps',
  description: "Install this application's dependencies",
  hidden: true,
  options: {
    hostname: targetHostnameCliInput,
    reset: createFlagInput(),
  },
  async action(_, { hostname, reset }) {
    await underscoreTestStarterAppsComponent({ reset, targetHostname: hostname });
  },
});
