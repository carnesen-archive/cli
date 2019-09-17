import { createLeaf, TerseError } from '@alwaysai/alwayscli';

import { yesCliInput } from '../../cli-inputs/yes-cli-input';

export const appInstallCliLeaf = createLeaf({
  name: 'install',
  description: "Install this application's dependencies",
  hidden: true,
  options: {
    yes: yesCliInput,
  },
  async action() {
    throw new TerseError('Not yet implemented');
  },
});
