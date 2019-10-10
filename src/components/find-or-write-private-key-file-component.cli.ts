import { CliLeaf, CliFlagInput, runCliAndExit } from '@alwaysai/alwayscli';
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

const leaf = CliLeaf({
  name: basename(__filename),
  namedInputs: {
    yes: yesCliInput,
    rm: CliFlagInput({
      description: `Remove ${PRIVATE_KEY_FILE_PRETTY_PATH} and ${PUBLIC_KEY_FILE_PRETTY_PATH} first`,
    }),
    'rm-pub': CliFlagInput({
      description: `Remove ${PUBLIC_KEY_FILE_PRETTY_PATH} first`,
    }),
  },
  async action(_, { yes, rm, ...rest }) {
    if (rm) {
      rimraf.sync(PRIVATE_KEY_FILE_PATH);
      rimraf.sync(PUBLIC_KEY_FILE_PATH);
    }
    if (rest['rm-pub']) {
      rimraf.sync(PUBLIC_KEY_FILE_PATH);
    }
    await findOrWritePrivateKeyFileComponent({
      yes,
    });
  },
});

if (module === require.main) {
  runCliAndExit(leaf);
}
