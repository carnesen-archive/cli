import { CliLeaf, CliFlagInput, runCliAndExit } from '@alwaysai/alwayscli';
import { findOrWriteAppJsonFileComponent } from './find-or-write-app-json-file-component';
import { AppJsonFile } from '../util/app-json-file';
import { yesCliInput } from '../cli-inputs/yes-cli-input';

const leaf = CliLeaf({
  name: findOrWriteAppJsonFileComponent.name,
  namedInputs: {
    yes: yesCliInput,
    rm: CliFlagInput({ description: 'Remove the config file first' }),
  },
  async action(_, { yes, rm }) {
    const appJsonFile = AppJsonFile();
    if (rm) {
      appJsonFile.remove();
    }
    await findOrWriteAppJsonFileComponent({
      yes,
    });
  },
});

if (module === require.main) {
  runCliAndExit(leaf);
}
