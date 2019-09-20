import { createLeaf, createFlagInput } from '@alwaysai/alwayscli';

import { underscoreTestStarterAppsComponent } from '../components/underscore-test-starter-apps-component';
import { targetHostnameCliInput } from '../cli-inputs/target-hostname-cli-input';
import { ALWAYSAI_SHOW_HIDDEN } from '../environment';
import { yesCliInput } from '../cli-inputs/yes-cli-input';

export const underscoreTestStarterAppsCliLeaf = createLeaf({
  name: '_test-starter-apps',
  description: "Install this application's dependencies",
  hidden: !ALWAYSAI_SHOW_HIDDEN,
  options: {
    yes: yesCliInput,
    hostname: targetHostnameCliInput,
    reset: createFlagInput(),
  },
  async action(_, { yes, hostname, reset }) {
    await underscoreTestStarterAppsComponent({ yes, reset, targetHostname: hostname });
  },
});
