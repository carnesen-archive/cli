import { createLeaf, createFlagInput } from '@alwaysai/alwayscli';

import { underscoreTestStarterAppsComponent } from '../components/underscore-test-starter-apps-component';
import { targetHostnameCliInput } from '../cli-inputs/target-hostname-cli-input';
import { ALWAYSAI_SHOW_HIDDEN } from '../environment';

export const underscoreTestStarterAppsCliLeaf = createLeaf({
  name: '_test-starter-apps',
  description: "Install this application's dependencies",
  hidden: !ALWAYSAI_SHOW_HIDDEN,
  options: {
    hostname: targetHostnameCliInput,
    reset: createFlagInput(),
  },
  async action(_, { hostname, reset }) {
    await underscoreTestStarterAppsComponent({ reset, targetHostname: hostname });
  },
});
