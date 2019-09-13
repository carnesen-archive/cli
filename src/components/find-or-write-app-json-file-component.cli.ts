import { runAndExit, createCli, createLeaf, createFlagInput } from '@alwaysai/alwayscli';
import { findOrWriteAppJsonFileComponent } from './find-or-write-app-json-file-component';
import { appConfigFile } from '../util/app-json-file';
import { yesCliInput } from '../cli-inputs/yes-cli-input';

const leaf = createLeaf({
  name: findOrWriteAppJsonFileComponent.name,
  options: {
    yes: yesCliInput,
    rm: createFlagInput({ description: 'Remove the config file first' }),
  },
  async action(_, { yes, rm }) {
    if (rm) {
      appConfigFile.remove();
    }
    await findOrWriteAppJsonFileComponent({
      yes,
    });
  },
});

const cli = createCli(leaf);

if (module === require.main) {
  runAndExit(cli, ...process.argv.slice(2));
}
