import { CliLeaf, CliFlagInput } from '@alwaysai/alwayscli';

import { ALWAYSAI_SHOW_HIDDEN } from '../environment';
import { testScratchAppComponent } from '../components/test-scratch-app-component';
import { yesCliInput } from '../cli-inputs/yes-cli-input';
import { targetHostnameCliInput } from '../cli-inputs/target-hostname-cli-input';

export const testScratchAppCliLeaf = CliLeaf({
  name: 'test-scratch-app',
  description: 'Test the workflow for creating a new application "from scratch"',
  hidden: !ALWAYSAI_SHOW_HIDDEN,
  namedInputs: {
    hostname: targetHostnameCliInput,
    yes: yesCliInput,
    reset: CliFlagInput(),
  },
  async action(_, { reset, yes, hostname }) {
    await testScratchAppComponent({ reset, yes, targetHostname: hostname });
  },
});
