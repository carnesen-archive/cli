import { createLeaf } from '@alwaysai/alwayscli';
import { targetConfigFile } from '../../util/target-config-file';
import { ACTIVATE } from '../../app-installer';

export const appShellCliLeaf = createLeaf({
  name: 'shell',
  description: 'Launch a bash shell in the target directory',
  async action() {
    const targetSpawner = targetConfigFile.readContainerSpawner();

    const targetConfig = targetConfigFile.read();
    switch (targetConfig.targetProtocol) {
      case 'docker:': {
        targetSpawner.runForegroundSync({
          exe: '/bin/bash',
          args: ['--rcfile', ACTIVATE],
          tty: true,
          cwd: '.',
          expose5000: true,
        });
        break;
      }

      case 'ssh+docker:': {
        targetSpawner.runForegroundSync({
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
