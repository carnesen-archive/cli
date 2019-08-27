import { runAndExit, createCli, createLeaf, createFlagInput } from '@alwaysai/alwayscli';
import rimraf = require('rimraf');
import { basename } from 'path';
import { findOrWritePrivateKeyFileComponent } from './find-or-write-private-key-file-component';
import { yesCliInput } from '../cli-inputs/yes-cli-input';
import {
  PRIVATE_KEY_FILE_PRETTY_PATH,
  PRIVATE_KEY_FILE_PATH,
  PUBLIC_KEY_FILE_PRETTY_PATH,
  PUBLIC_KEY_FILE_PATH,
} from '../constants';

const leaf = createLeaf({
  name: basename(__filename),
  options: {
    yes: yesCliInput,
    rm: createFlagInput({
      description: `Remove ${PRIVATE_KEY_FILE_PRETTY_PATH} and ${PUBLIC_KEY_FILE_PRETTY_PATH} first`,
    }),
    'rm-pub': createFlagInput({
      description: `Remove ${PUBLIC_KEY_FILE_PRETTY_PATH} first`,
    }),
    we: createFlagInput({ description: 'Set "weAreInAppConfigure" to true' }),
  },
  async action(_, { yes, we, rm, ...rest }) {
    if (rm) {
      rimraf.sync(PRIVATE_KEY_FILE_PATH);
      rimraf.sync(PUBLIC_KEY_FILE_PATH);
    }
    if (rest['rm-pub']) {
      rimraf.sync(PUBLIC_KEY_FILE_PATH);
    }
    await findOrWritePrivateKeyFileComponent({
      yes,
      weAreInAppConfigure: we,
    });
  },
});

const cli = createCli(leaf);

if (module === require.main) {
  runAndExit(cli, ...process.argv.slice(2));
}
