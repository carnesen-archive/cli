import { createLeaf } from '@alwaysai/alwayscli';
import { targetConfigFile } from '../../util/target-config-file';
import { ACTIVATE } from '../../app-installer';

export const appShellCliLeaf = createLeaf({
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
