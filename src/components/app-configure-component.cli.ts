import { CliLeaf, runCliAndExit } from '@alwaysai/alwayscli';
import { appConfigureComponent } from './app-configure-component';
import { yesCliInput } from '../cli-inputs/yes-cli-input';

const leaf = CliLeaf({
  name: appConfigureComponent.name,
  namedInputs: {
    yes: yesCliInput,
  },
  async action(_, { yes }) {
    return await appConfigureComponent({
      yes,
    });
  },
});

if (module === require.main) {
  runCliAndExit(leaf);
}
