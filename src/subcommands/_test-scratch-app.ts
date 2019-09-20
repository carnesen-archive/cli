import { createLeaf, createFlagInput } from '@alwaysai/alwayscli';

import { ALWAYSAI_SHOW_HIDDEN } from '../environment';
import { underscoreTestScratchAppComponent } from '../components/underscore-test-scratch-app-component';
import { yesCliInput } from '../cli-inputs/yes-cli-input';

export const underscoreTestScratchAppCliLeaf = createLeaf({
  name: '_test-scratch-app',
  description: "Install this application's dependencies",
  hidden: !ALWAYSAI_SHOW_HIDDEN,
  options: {
    yes: yesCliInput,
    reset: createFlagInput(),
  },
  async action(_, { reset, yes }) {
    await underscoreTestScratchAppComponent({ reset, yes });
  },
});
