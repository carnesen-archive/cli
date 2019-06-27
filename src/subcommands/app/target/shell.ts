import { createLeaf } from '@alwaysai/alwayscli';
import { targetConfigFile } from './target-config-file';
import { ACTIVATE } from '../../../app-installer';

export const shell = createLeaf({
  name: 'shell',
  description: 'Run a shell in the target environment',
  action() {
    const target = targetConfigFile.readSpawner();
    const targetConfig = targetConfigFile.read();
    switch (targetConfig.protocol) {
      case 'docker:': {
        target.runForegroundSync({
          exe: '/bin/bash',
          args: ['--rcfile', ACTIVATE],
          tty: true,
          cwd: '.',
          expose5000: true,
        });
        break;
      }

      case 'ssh:': {
        target.runForegroundSync({
          exe: `cd "${target.resolvePath()}"; /bin/bash --rcfile ${ACTIVATE}`,
          tty: true,
          expose5000: true,
        });
        break;
      }

      case 'ssh+docker:': {
        target.runForegroundSync({
          exe: '/bin/bash',
          args: ['--rcfile', ACTIVATE],
          tty: true,
          cwd: '.',
          expose5000: true,
        });
        break;
      }

      default: {
        throw new Error('Unsupported protocol');
      }
    }
  },
});
