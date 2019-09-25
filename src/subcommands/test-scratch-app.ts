import { createLeaf, createFlagInput } from '@alwaysai/alwayscli';

import { ALWAYSAI_SHOW_HIDDEN } from '../environment';
import { testScratchAppComponent } from '../components/test-scratch-app-component';
import { yesCliInput } from '../cli-inputs/yes-cli-input';
import { targetHostnameCliInput } from '../cli-inputs/target-hostname-cli-input';

export const testScratchAppCliLeaf = createLeaf({
  name: 'test-scratch-app',
  description: "Install this application's dependencies",
  hidden: !ALWAYSAI_SHOW_HIDDEN,
  options: {
    hostname: targetHostnameCliInput,
    yes: yesCliInput,
    reset: createFlagInput(),
  },
  async action(_, { reset, yes, hostname }) {
    await testScratchAppComponent({ reset, yes, targetHostname: hostname });
  },
});
