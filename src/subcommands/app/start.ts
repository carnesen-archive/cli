import { createLeaf, TerseError, createFlagInput } from '@alwaysai/alwayscli';

import { appConfigFile } from '../../util/app-json-file';
import { targetConfigFile } from '../../util/target-config-file';
import { VENV_BIN_ACTIVATE } from '../../constants';

// Currently we run the "start" command as a superuser because otherwise we
// cannot connect to the NCS accelerator. It ~should~ be possible to connect to
// the NCS even without --privileged mode, but we need to do the work to set
// that up. See https://movidius.github.io/ncsdk/docker.html

export const appStartCliLeaf = createLeaf({
  name: 'start',
  options: {
    'no-superuser': createFlagInput({
      description:
        'Launch the application as the login user rather than as the superuser "root"',
    }),
  },
  description: 'Run this application "start" script on the target',
  async action(_, opts) {
    const appConfig = appConfigFile.read();
    const script = appConfig.scripts && appConfig.scripts.start;
    if (!script) {
      throw new TerseError('This application does not define a "start" script');
    }
    const spawner = targetConfigFile.readContainerSpawner();
    const targetConfig = targetConfigFile.read();

    switch (targetConfig.targetProtocol) {
      case 'docker:': {
        await spawner.runForeground({
          exe: '/bin/bash',
          args: [
            '-o',
            'onecmd',
            '-O',
            'huponexit',
            '-c',
            `. ${VENV_BIN_ACTIVATE} && ${script}`,
          ],
          cwd: '.',
          tty: true,
          expose5000: true,
          superuser: !opts['no-superuser'],
        });
        return;
      }

      // This case differs from "docker:"" only in the extra single quotes around the command
      case 'ssh+docker:': {
        await spawner.runForeground({
          exe: '/bin/bash',
          args: [
            '-o',
            'onecmd',
            '-O',
            'huponexit',
            '-c',
            `'. ${VENV_BIN_ACTIVATE} && ${script}'`,
          ],
          cwd: '.',
          tty: true,
          expose5000: true,
          superuser: !opts['no-superuser'],
        });
        return;
      }

      default: {
        throw new Error('Unsupported protocol');
      }
    }
  },
});
