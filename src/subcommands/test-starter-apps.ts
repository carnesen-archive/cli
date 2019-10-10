import { CliLeaf, CliFlagInput } from '@alwaysai/alwayscli';

import { underscoreTestStarterAppsComponent } from '../components/test-starter-apps-component';
import { targetHostnameCliInput } from '../cli-inputs/target-hostname-cli-input';
import { ALWAYSAI_SHOW_HIDDEN } from '../environment';
import { yesCliInput } from '../cli-inputs/yes-cli-input';

export const testStarterAppsCliLeaf = CliLeaf({
  name: 'test-starter-apps',
  description: "Install this application's dependencies",
  hidden: !ALWAYSAI_SHOW_HIDDEN,
  namedInputs: {
    yes: yesCliInput,
    hostname: targetHostnameCliInput,
    reset: CliFlagInput(),
  },
  async action(_, { yes, hostname, reset }) {
    await underscoreTestStarterAppsComponent({ yes, reset, targetHostname: hostname });
  },
});
