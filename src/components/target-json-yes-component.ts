import { checkForDockerComponent } from './check-for-docker-component';
import { writeTargetConfigFileComponent } from './write-target-config-file-component';
import { checkSshConnectivityComponent } from './check-ssh-connectivity-component';
import { findOrWritePrivateKeyFileComponent } from './find-or-write-private-key-file-component';
import { createTargetDirectoryComponent } from './create-target-directory-component';

const yes = true;

export async function targetJsonYesComponent(props: {
  targetConfig: Parameters<typeof writeTargetConfigFileComponent>[0];
}) {
  const { targetConfig } = props;
  switch (targetConfig.targetProtocol) {
    case 'docker:':
      await checkForDockerComponent();
      writeTargetConfigFileComponent(targetConfig);
      break;

    case 'ssh+docker:':
      const { targetHostname, targetPath } = targetConfig;
      await findOrWritePrivateKeyFileComponent({ yes });
      await checkSshConnectivityComponent({
        targetHostname,
      });
      await checkForDockerComponent({ targetHostname });
      await createTargetDirectoryComponent({ targetHostname, targetPath });
      await writeTargetConfigFileComponent(targetConfig);
      break;

    default:
      throw new Error('Unexpected target protocol');
  }
}
