import {
  createLeaf,
  createStringArrayInput,
  createFlagInput,
  TerseError,
} from '@alwaysai/alwayscli';
import { TargetJsonFile } from '../../util/target-json-file';

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
    const targetJsonFile = TargetJsonFile();
    if (opts['no-container']) {
      if (opts.superuser) {
        throw new TerseError('--superuser is not yet supported with --no-container');
      }
      targetJsonFile.readHostSpawner().runForegroundSync({ exe, args, cwd: '.' });
    } else {
      targetJsonFile
        .readContainerSpawner()
        .runForegroundSync({ exe, args, cwd: '.', superuser: opts.superuser });
    }
  },
});
