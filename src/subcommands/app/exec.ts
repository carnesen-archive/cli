import {
  CliLeaf,
  CliStringArrayInput,
  CliFlagInput,
  CliTerseError,
} from '@alwaysai/alwayscli';
import { TargetJsonFile } from '../../util/target-json-file';

export const appExecCliLeaf = CliLeaf({
  name: 'exec',
  description: 'Run a command in the target directory',
  namedInputs: {
    superuser: CliFlagInput({ description: 'Run the command as superuser "root"' }),
    'no-container': CliFlagInput({
      description: 'Run the command directly on the target host, not in a container',
    }),
  },
  positionalInput: CliStringArrayInput({
    placeholder: '<command> [<args>]',
    required: true,
  }),
  async action([exe, ...args], opts) {
    const targetJsonFile = TargetJsonFile();
    if (opts['no-container']) {
      if (opts.superuser) {
        throw new CliTerseError('--superuser is not yet supported with --no-container');
      }
      targetJsonFile.readHostSpawner().runForegroundSync({ exe, args, cwd: '.' });
    } else {
      targetJsonFile
        .readContainerSpawner()
        .runForegroundSync({ exe, args, cwd: '.', superuser: opts.superuser });
    }
  },
});
