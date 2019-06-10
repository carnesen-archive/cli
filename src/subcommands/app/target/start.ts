import { createLeaf, TerseError } from '@alwaysai/alwayscli';

import { appConfigFile } from '../../../config/app-config-file';
import { targetConfigFile } from './target-config-file';
import { ACTIVATE } from '../../../app-installer';
import { spawnerBase } from '../../../spawner/spawner-base';

export const appTargetStart = createLeaf({
  name: 'start',
  options: {},
  description: 'Run this application "start" script on the target',
  action() {
    const appConfig = appConfigFile.read();
    const script = appConfig.scripts && appConfig.scripts.start;
    if (!script) {
      throw new TerseError('This application does not define a "start" script');
    }
    const spawner = targetConfigFile.readSpawner();
    const targetConfig = targetConfigFile.read();

    switch (targetConfig.protocol) {
      case 'docker:': {
        spawner.runForeground({
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
        spawner.runForeground({
          exe: '/bin/bash',
          args: ['-t', '-c', `'. ${ACTIVATE} && ${script}'`],
          tty: true,
          cwd: '.',
          expose5000: true,
        });
        return;
      }

      case 'ssh:': {
        const command = `cd ${spawner.resolvePath()} && . ${ACTIVATE} && ${script}`;

        spawnerBase.runForeground({
          exe: 'ssh',
          args: ['-L', '5000:0.0.0.0:5000', '-t', targetConfig.hostname, command],
        });
        return;
      }

      default: {
        throw new Error('Unsupported protocol');
      }
    }
  },
});
