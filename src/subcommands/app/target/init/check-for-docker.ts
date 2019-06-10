import ora = require('ora');

import { SshSpawner } from '../../../../spawner/ssh-spawner';
import { JsSpawner } from '../../../../spawner/js-spawner';
import { echo } from '../../../../util/echo';
import { IMAGE_NAME } from '../../../../spawner/docker-spawner';
import { confirmSave } from './confirm-save';

export async function checkForDocker(
  opts: Partial<{ hostname: string; yes: boolean }> = {},
) {
  const spawner = opts.hostname
    ? SshSpawner({ hostname: opts.hostname, path: '/tmp' })
    : JsSpawner();
  let foundExecutable = false;
  {
    const spinner = ora('Check for docker executable').start();
    spinner.start();
    try {
      await spawner.run({ exe: 'docker', args: ['--version'] });
      spinner.succeed();
      foundExecutable = true;
    } catch (ex) {
      spinner.fail('Command "docker --version" failed');
      echo(ex.message);
      await confirmSave(opts.yes || false);
    }
  }

  if (foundExecutable) {
    const spinner = ora(`Check for docker image "${IMAGE_NAME}"`).start();
    try {
      await spawner.run({ exe: 'docker', args: ['image', 'inspect', IMAGE_NAME] });
      spinner.succeed();
    } catch (ex) {
      if (
        !(ex && typeof ex.message === 'string' && ex.message.includes('No such image'))
      ) {
        throw ex;
      }
      spinner.text = `Pull image "${IMAGE_NAME}"`;
      await spawner.run({ exe: 'docker', args: ['image', 'pull', IMAGE_NAME] });
      spinner.succeed();
    }
  }
}
