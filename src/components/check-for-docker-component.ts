import ora = require('ora');

import { SshSpawner } from '../spawner/ssh-spawner';
import { JsSpawner } from '../spawner/js-spawner';
import { echo } from '../util/echo';
import { IMAGE_NAME } from '../spawner/docker-spawner';
import { TerseError } from '@alwaysai/alwayscli';

export async function checkForDockerComponent(props: { targetHostname?: string } = {}) {
  const spawner = props.targetHostname
    ? SshSpawner({ hostname: props.targetHostname })
    : JsSpawner();

  {
    const spinner = ora('Check for docker executable').start();
    spinner.start();
    try {
      await spawner.run({ exe: 'docker', args: ['--version'] });
      spinner.succeed();
    } catch (ex) {
      spinner.fail('Command "docker --version" failed');
      echo(ex.message);
      echo(
        `Please install docker${
          props.targetHostname ? ' on your target system' : ''
        }, or \nverify the existing installation if there is one.`,
      );
      echo();
      echo('For installation instructions for your operating system, see:');
      echo();
      echo('  https://docs.docker.com/install/');
      echo();
      throw new TerseError('Failed to run "docker --version"');
    }
  }

  {
    const spinner = ora('Check docker permissions').start();
    spinner.start();
    try {
      await spawner.run({ exe: 'docker', args: ['run', '--rm', 'hello-world'] });
      spinner.succeed();
    } catch (ex) {
      spinner.fail('Command "docker run hello-world" failed');
      echo(ex.message);
      echo(
        'Please double-check that you\'ve complete the "Manage Docker as a non-root user" post-install steps described here:',
      );
      echo();
      echo('  https://docs.docker.com/install/linux/linux-postinstall/');
      echo();
      throw new TerseError('Failed to run "docker run hello-world"');
    }
  }

  {
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
