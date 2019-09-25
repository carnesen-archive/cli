import { createLeaf, createFlagInput } from '@alwaysai/alwayscli';

import { ALWAYSAI_SHOW_HIDDEN } from '../environment';
import { testScratchAppComponent } from '../components/test-scratch-app-component';
import { yesCliInput } from '../cli-inputs/yes-cli-input';
import { nodejsPlatformCliInput } from '../cli-inputs/nodejs-platform-cli-input';

export const testScratchAppCliLeaf = createLeaf({
  name: 'test-scratch-app',
  description: "Install this application's dependencies",
  hidden: !ALWAYSAI_SHOW_HIDDEN,
  options: {
    yes: yesCliInput,
    reset: createFlagInput(),
    platform: nodejsPlatformCliInput,
  },
  async action(_, { reset, yes, platform }) {
    await testScratchAppComponent({ reset, yes, nodejsPlatform: platform });
  },
});
