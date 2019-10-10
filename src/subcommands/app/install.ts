import { CliLeaf } from '@alwaysai/alwayscli';

import { yesCliInput } from '../../cli-inputs/yes-cli-input';
import { appInstallComponent } from '../../components/app-install-component';
import { ALWAYSAI_HOME } from '../../environment';

export const appInstallCliLeaf = CliLeaf({
  name: 'install',
  description: "Install this application's dependencies",
  hidden: !Boolean(ALWAYSAI_HOME),
  namedInputs: {
    yes: yesCliInput,
  },
  async action(_, { yes }) {
    await appInstallComponent({ yes });
  },
});
