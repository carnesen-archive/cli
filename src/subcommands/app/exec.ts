import {
  createLeaf,
  createStringArrayInput,
  createFlagInput,
  TerseError,
} from '@alwaysai/alwayscli';
import { targetConfigFile } from '../../util/target-config-file';

export const appExecCliLeaf = createLeaf({
  name: 'exec',
  description: 'Run a command in the target directory',
  options: {
    superuser: createFlagInput({ description: 'Run the command as superuser "root"' }),
    'no-container': createFlagInput({
      description: 'Run the command directly on the target host, not in a container',
    }),
  },
  args: createStringArrayInput({
    placeholder: '<command> [<args>]',
    required: true,
  }),
  async action([exe, ...args], opts) {
    if (opts['no-container']) {
      if (opts.superuser) {
        throw new TerseError('--superuser is not yet supported with --no-container');
      }
      targetConfigFile.readHostSpawner().runForegroundSync({ exe, args, cwd: '.' });
    } else {
      targetConfigFile
        .readContainerSpawner()
        .runForegroundSync({ exe, args, cwd: '.', superuser: opts.superuser });
    }
  },
});
