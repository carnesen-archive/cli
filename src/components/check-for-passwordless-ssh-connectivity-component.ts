import ora = require('ora');
import { SshSpawner } from '../spawner/ssh-spawner';

export async function checkForPasswordlessSshConnectivityComponent(props: {
  targetHostname: string;
}) {
  const spinner = ora('Check passwordless ssh connectivity').start();
  const spawner = SshSpawner({ targetHostname: props.targetHostname });
  try {
    await spawner.run({ exe: 'ls' });
    spinner.succeed();
  } catch (exception) {
    spinner.fail();
    throw exception;
  }
}
