import { runAndExit, createCli, createLeaf, createFlagInput } from '@alwaysai/alwayscli';
import { findOrWriteAppJsonFileComponent } from './find-or-write-app-json-file-component';
import { appConfigFile } from '../util/app-config-file';
import { yesCliInput } from '../cli-inputs/yes-cli-input';

const leaf = createLeaf({
  name: findOrWriteAppJsonFileComponent.name,
  options: {
    yes: yesCliInput,
    rm: createFlagInput({ description: 'Remove the config file first' }),
    we: createFlagInput({ description: 'Set "weAreInAppConfigure" to true' }),
  },
  async action(_, { yes, rm, we }) {
    if (rm) {
      appConfigFile.remove();
    }
    await findOrWriteAppJsonFileComponent({
      yes,
      weAreInAppConfigure: we,
    });
  },
});

const cli = createCli(leaf);

if (module === require.main) {
  runAndExit(cli, ...process.argv.slice(2));
}
