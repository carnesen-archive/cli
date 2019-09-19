import { checkForDockerComponent } from './check-for-docker-component';
import { writeTargetJsonFileComponent } from './write-target-json-file-component';
import { checkSshConnectivityComponent } from './check-ssh-connectivity-component';
import { findOrWritePrivateKeyFileComponent } from './find-or-write-private-key-file-component';
import { createTargetDirectoryComponent } from './create-target-directory-component';
import { TargetJson } from '../util/target-json-file';

const yes = true;

export async function targetJsonYesComponent(props: { targetJson: TargetJson }) {
  const { targetJson } = props;
  switch (targetJson.targetProtocol) {
    case 'docker:':
      await checkForDockerComponent();
      writeTargetJsonFileComponent(targetJson);
      break;

    case 'ssh+docker:':
      const { targetHostname, targetPath } = targetJson;
      await findOrWritePrivateKeyFileComponent({ yes });
      await checkSshConnectivityComponent({
        targetHostname,
      });
      await checkForDockerComponent({ targetHostname });
      await createTargetDirectoryComponent({ targetHostname, targetPath });
      await writeTargetJsonFileComponent(targetJson);
      break;

    default:
      throw new Error('Unexpected target protocol');
  }
}
