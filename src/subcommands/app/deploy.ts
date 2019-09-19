import { createLeaf } from '@alwaysai/alwayscli';

import { yesCliInput } from '../../cli-inputs/yes-cli-input';
import { appDeployComponent } from '../../components/app-deploy-component';

export const appDeployCliLeaf = createLeaf({
  name: 'deploy',
  description: 'Deploy this application to a target device',
  options: {
    yes: yesCliInput,
  },
  async action(_, opts) {
    return await appDeployComponent({
      yes: opts.yes,
    });
  },
});
