import { CliLeaf, CliFlagInput, runCliAndExit } from '@alwaysai/alwayscli';
import { yesCliInput } from '../cli-inputs/yes-cli-input';
import { findOrWriteAppPyFileComponent } from './find-or-write-app-py-file-component';
import { APP_PY_FILE_NAME } from '../constants';
import rimraf = require('rimraf');

const leaf = CliLeaf({
  name: findOrWriteAppPyFileComponent.name,
  namedInputs: {
    yes: yesCliInput,
    rm: CliFlagInput({ description: `Remove ${APP_PY_FILE_NAME} first` }),
  },
  async action(_, { yes, rm }) {
    if (rm) {
      rimraf.sync(APP_PY_FILE_NAME);
    }
    await findOrWriteAppPyFileComponent({
      yes,
    });
  },
});

if (module === require.main) {
  runCliAndExit(leaf);
}
