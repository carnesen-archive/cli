import { runAndExit, createCli, createLeaf, createFlagInput } from '@alwaysai/alwayscli';
import { findOrWriteDockerfileComponent } from './find-or-write-dockerfile-component';
import { yesCliInput } from '../cli-inputs/yes-cli-input';
import { DOCKERFILE } from '../constants';
import rimraf = require('rimraf');
import { basename } from 'path';

const leaf = createLeaf({
  name: basename(__filename),
  options: {
    yes: yesCliInput,
    rm: createFlagInput({ description: `Remove ${DOCKERFILE} first` }),
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

const cli = createCli(leaf);

if (module === require.main) {
  runAndExit(cli, ...process.argv.slice(2));
}
