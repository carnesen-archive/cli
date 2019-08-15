import { createLeaf, createFlagInput, TerseError } from '@alwaysai/alwayscli';
import { targetConfigFile } from '../../util/target-config-file';
import { ACTIVATE } from '../../app-installer';

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
    const targetConfig = targetConfigFile.read();
    switch (targetConfig.targetProtocol) {
      case 'docker:': {
        targetConfigFile.readContainerSpawner().runForegroundSync({
          exe: '/bin/bash',
          args: ['--rcfile', ACTIVATE],
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
          targetConfigFile.readHostSpawner().runForegroundSync({
            exe: '/bin/bash',
            tty: true,
            cwd: '.',
            expose5000: true,
          });
        } else {
          targetConfigFile.readContainerSpawner().runForegroundSync({
            exe: '/bin/bash',
            args: ['--rcfile', ACTIVATE],
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
