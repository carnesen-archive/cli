import { CliLeaf, CliFlagInput, runCliAndExit } from '@alwaysai/alwayscli';
import { findOrWriteDockerfileComponent } from './find-or-write-dockerfile-component';
import { yesCliInput } from '../cli-inputs/yes-cli-input';
import { DOCKERFILE } from '../constants';
import rimraf = require('rimraf');
import { basename } from 'path';

const leaf = CliLeaf({
  name: basename(__filename),
  namedInputs: {
    yes: yesCliInput,
    rm: CliFlagInput({ description: `Remove ${DOCKERFILE} first` }),
  },
  async action(_, { yes, rm }) {
    if (rm) {
      rimraf.sync(DOCKERFILE);
    }
    await findOrWriteDockerfileComponent({
      yes,
    });
  },
});

if (module === require.main) {
  runCliAndExit(leaf);
}
