import ora = require('ora');

import { SshSpawner } from '../spawner/ssh-spawner';
import { JsSpawner } from '../spawner/js-spawner';
import { echo } from '../util/echo';
import { TerseError } from '@alwaysai/alwayscli';
import { DOCKER_TEST_IMAGE_ID } from '../constants';

export async function checkForDockerComponent(props: { targetHostname?: string } = {}) {
  const spawner = props.targetHostname
    ? SshSpawner({ targetHostname: props.targetHostname })
    : JsSpawner();

  {
    const spinner = ora('Check docker executable').start();
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
      await spawner.run({
        exe: 'docker',
        args: ['run', '--rm', DOCKER_TEST_IMAGE_ID],
      });
      spinner.succeed();
    } catch (ex) {
      spinner.fail(`Command "docker run ${DOCKER_TEST_IMAGE_ID}" failed`);
      echo(ex.message);
      echo(
        'Please double-check that you\'ve complete the "Manage Docker as a non-root user" post-install steps described here:',
      );
      echo();
      echo('  https://docs.docker.com/install/linux/linux-postinstall/');
      echo();
      throw new TerseError(`Failed to run "docker run ${DOCKER_TEST_IMAGE_ID}"`);
    }
  }
}
