import { runAndExit, createCli, createLeaf } from '@alwaysai/alwayscli';
import { appConfigureComponent } from './app-configure-component';
import { yesCliInput } from '../cli-inputs/yes-cli-input';

const leaf = createLeaf({
  name: appConfigureComponent.name,
  options: {
    yes: yesCliInput,
  },
  async action(_, { yes }) {
    return await appConfigureComponent({
      yes,
    });
  },
});

const cli = createCli(leaf);

if (module === require.main) {
  runAndExit(cli, ...process.argv.slice(2));
}
