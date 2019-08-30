import { targetProtocolPromptComponent } from './target-protocol-prompt-component';
import { TargetProtocol } from '../util/target-protocol';
import { checkForDockerComponent } from './check-for-docker-component';
import { targetConfigFile } from '../util/target-config-file';
import { targetHostnamePromptComponent } from './target-hostname-prompt-component';
import { targetPathPromptComponent } from './target-path-prompt-component';
import { DOCKER_IMAGE_ID_INITIAL_VALUE } from '../constants';
import { writeTargetConfigFileComponent } from './write-target-config-file-component';
import { findOrWritePrivateKeyFileComponent } from './find-or-write-private-key-file-component';

export async function targetJsonPromptComponent(
  props: {
    targetProtocol?: TargetProtocol;
    targetHostname?: string;
    targetPath?: string;
  } = {},
) {
  const currentTargetConfiguration = targetConfigFile.readIfExists();
  const targetProtocol = await targetProtocolPromptComponent({
    targetProtocol:
      props.targetProtocol ||
      (currentTargetConfiguration && currentTargetConfiguration.targetProtocol),
  });

  switch (targetProtocol) {
    case 'docker:':
      await checkForDockerComponent();
      writeTargetConfigFileComponent({
        targetProtocol,
        dockerImageId: DOCKER_IMAGE_ID_INITIAL_VALUE,
      });
      break;

    case 'ssh+docker:':
      await findOrWritePrivateKeyFileComponent({ yes: false });
      let currentTargetHostname: string | undefined;
      let currentTargetPath: string | undefined;
      if (
        currentTargetConfiguration &&
        currentTargetConfiguration.targetProtocol === 'ssh+docker:'
      ) {
        currentTargetHostname = currentTargetConfiguration.targetHostname;
        currentTargetPath = currentTargetConfiguration.targetPath;
      }
      const targetHostname = await targetHostnamePromptComponent({
        targetHostname: props.targetHostname || currentTargetHostname,
      });

      await checkForDockerComponent({ targetHostname });

      const targetPath = await targetPathPromptComponent({
        targetHostname,
        targetPath: props.targetPath || currentTargetPath,
      });

      await writeTargetConfigFileComponent({
        targetProtocol,
        targetHostname,
        targetPath,
        dockerImageId: DOCKER_IMAGE_ID_INITIAL_VALUE,
      });
      break;

    default:
      throw new Error(`Unexpected target protocol ${targetProtocol}`);
  }
}
