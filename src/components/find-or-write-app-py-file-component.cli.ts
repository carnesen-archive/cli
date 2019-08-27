import { runAndExit, createCli, createLeaf, createFlagInput } from '@alwaysai/alwayscli';
import { yesCliInput } from '../cli-inputs/yes-cli-input';
import { findOrWriteAppPyFileComponent } from './find-or-write-app-py-file-component';
import { APP_PY_FILE_NAME } from '../constants';
import rimraf = require('rimraf');

const leaf = createLeaf({
  name: findOrWriteAppPyFileComponent.name,
  options: {
    yes: yesCliInput,
    rm: createFlagInput({ description: `Remove ${APP_PY_FILE_NAME} first` }),
    we: createFlagInput({ description: 'Set "weAreInAppConfigure" to true' }),
  },
  async action(_, { yes, rm, we }) {
    if (rm) {
      rimraf.sync(APP_PY_FILE_NAME);
    }
    await findOrWriteAppPyFileComponent({
      yes,
      weAreInAppConfigure: we,
    });
  },
});

const cli = createCli(leaf);

if (module === require.main) {
  runAndExit(cli, ...process.argv.slice(2));
}
