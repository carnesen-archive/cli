import { createLeaf, TerseError } from '@alwaysai/alwayscli';

import { appConfigFile } from '../../util/app-config-file';
import { targetConfigFile } from '../../util/target-config-file';
import { ACTIVATE } from '../../app-installer';

export const appStartCliLeaf = createLeaf({
  name: 'start',
  options: {},
  description: 'Run this application "start" script on the target',
  async action() {
    const appConfig = appConfigFile.read();
    const script = appConfig.scripts && appConfig.scripts.start;
    if (!script) {
      throw new TerseError('This application does not define a "start" script');
    }
    const spawner = targetConfigFile.readSpawner();
    const targetConfig = targetConfigFile.read();

    switch (targetConfig.protocol) {
      case 'docker:': {
        await spawner.runForeground({
          exe: '/bin/bash',
          args: ['-t', '-c', `. ${ACTIVATE} && ${script}`],
          tty: true,
          cwd: '.',
          expose5000: true,
        });
        return;
      }

      // This case differs from "docker:"" only in the extra single quotes around the command
      case 'ssh+docker:': {
        await spawner.runForeground({
          exe: '/bin/bash',
          args: ['-t', '-c', `'. ${ACTIVATE} && ${script}'`],
          tty: true,
          cwd: '.',
          expose5000: true,
        });
        return;
      }

      default: {
        throw new Error('Unsupported protocol');
      }
    }
  },
});
