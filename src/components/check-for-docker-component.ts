import { SshSpawner } from '../util/spawner/ssh-spawner';
import { JsSpawner } from '../util/spawner/js-spawner';
import { echo } from '../util/echo';
import { CliTerseError } from '@alwaysai/alwayscli';
import { DOCKER_TEST_IMAGE_ID } from '../constants';
import { Spinner } from '../util/spinner';

export async function checkForDockerComponent(props: { targetHostname?: string } = {}) {
  const spawner = props.targetHostname
    ? SshSpawner({ targetHostname: props.targetHostname })
    : JsSpawner();

  {
    const spinner = Spinner('Check docker executable');
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
      throw new CliTerseError('Failed to run "docker --version"');
    }
  }

  {
    const spinner = Spinner('Check docker permissions');
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
      throw new CliTerseError(`Failed to run "docker run ${DOCKER_TEST_IMAGE_ID}"`);
    }
  }
}
