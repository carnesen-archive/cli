import ora = require('ora');
import { SshSpawner } from '../spawner/ssh-spawner';
import { echo } from '../util/echo';

export async function createTargetDirectoryComponent(props: {
  targetHostname: string;
  targetPath: string;
}) {
  const spinner = ora('Create target directory').start();
  let writable = false;
  try {
    const spawner = SshSpawner({
      hostname: props.targetHostname,
      path: props.targetPath,
    });
    await spawner.mkdirp();
    writable = true;
    spinner.succeed();
  } catch (ex) {
    spinner.fail();
    if (ex.message) {
      echo(ex.message);
    }
  }
  return writable;
}
