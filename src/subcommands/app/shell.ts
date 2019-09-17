import { createLeaf, createFlagInput, TerseError } from '@alwaysai/alwayscli';
import { TargetJsonFile } from '../../util/target-json-file';
import { VENV_BIN_ACTIVATE } from '../../constants';

export const appShellCliLeaf = createLeaf({
  name: 'shell',
  description: 'Launch a bash shell in the target directory',
  options: {
    'no-container': createFlagInput({
      description:
        'Open the shell on the target host, not in a container on the target host',
    }),
    superuser: createFlagInput({
      description: 'Open the shell as superuser "root"',
    }),
  },
  async action(_, opts) {
    const targetJsonFile = TargetJsonFile();
    const targetJson = targetJsonFile.read();
    switch (targetJson.targetProtocol) {
      case 'docker:': {
        targetJsonFile.readContainerSpawner().runForegroundSync({
          exe: '/bin/bash',
          args: ['--rcfile', VENV_BIN_ACTIVATE],
          tty: true,
          cwd: '.',
          expose5000: true,
          superuser: opts.superuser,
        });
        break;
      }

      case 'ssh+docker:': {
        if (opts['no-container']) {
          if (opts.superuser) {
            throw new TerseError('--superuser is not yet supported with --no-container');
          }
          targetJsonFile.readHostSpawner().runForegroundSync({
            exe: '/bin/bash',
            tty: true,
            cwd: '.',
            expose5000: true,
          });
        } else {
          targetJsonFile.readContainerSpawner().runForegroundSync({
            exe: '/bin/bash',
            args: ['--rcfile', VENV_BIN_ACTIVATE],
            tty: true,
            cwd: '.',
            expose5000: true,
            superuser: opts.superuser,
          });
        }
        break;
      }

      default: {
        throw new Error('Unsupported protocol');
      }
    }
  },
});
