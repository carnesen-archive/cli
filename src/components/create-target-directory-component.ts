import ora = require('ora');
import { SshSpawner } from '../util/spawner/ssh-spawner';

export async function createTargetDirectoryComponent(props: {
  targetHostname: string;
  targetPath: string;
}) {
  const spinner = ora('Create target directory').start();
  try {
    const spawner = SshSpawner({
      targetHostname: props.targetHostname,
      targetPath: props.targetPath,
    });
    await spawner.mkdirp();
    spinner.succeed();
  } catch (exception) {
    spinner.fail();
    throw exception;
  }
}
