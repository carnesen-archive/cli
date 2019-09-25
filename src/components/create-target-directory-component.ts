import { SshSpawner } from '../util/spawner/ssh-spawner';
import { Spinner } from '../util/spinner';

export async function createTargetDirectoryComponent(props: {
  targetHostname: string;
  targetPath: string;
}) {
  const spinner = Spinner('Create target directory');
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
