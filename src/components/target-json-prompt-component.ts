import { targetProtocolPromptComponent } from './target-protocol-prompt-component';
import { TargetProtocol } from '../util/target-protocol';
import { checkForDockerComponent } from './check-for-docker-component';
import { TargetJsonFile } from '../util/target-json-file';
import { targetHostnamePromptComponent } from './target-hostname-prompt-component';
import { targetPathPromptComponent } from './target-path-prompt-component';
import { DOCKER_IMAGE_ID_INITIAL_VALUE } from '../constants';
import { writeTargetJsonFileComponent } from './write-target-config-file-component';
import { findOrWritePrivateKeyFileComponent } from './find-or-write-private-key-file-component';

export async function targetJsonPromptComponent(
  props: {
    targetProtocol?: TargetProtocol;
    targetHostname?: string;
    targetPath?: string;
  } = {},
) {
  const currentTargetJson = TargetJsonFile().readIfExists();
  const targetProtocol = await targetProtocolPromptComponent({
    targetProtocol:
      props.targetProtocol || (currentTargetJson && currentTargetJson.targetProtocol),
  });

  switch (targetProtocol) {
    case 'docker:':
      await checkForDockerComponent();
      writeTargetJsonFileComponent({
        targetProtocol,
        dockerImageId: DOCKER_IMAGE_ID_INITIAL_VALUE,
      });
      break;

    case 'ssh+docker:':
      await findOrWritePrivateKeyFileComponent({ yes: false });
      let currentTargetHostname: string | undefined;
      let currentTargetPath: string | undefined;
      if (currentTargetJson && currentTargetJson.targetProtocol === 'ssh+docker:') {
        currentTargetHostname = currentTargetJson.targetHostname;
        currentTargetPath = currentTargetJson.targetPath;
      }
      const targetHostname = await targetHostnamePromptComponent({
        targetHostname: props.targetHostname || currentTargetHostname,
      });

      await checkForDockerComponent({ targetHostname });

      const targetPath = await targetPathPromptComponent({
        targetHostname,
        targetPath: props.targetPath || currentTargetPath,
      });

      await writeTargetJsonFileComponent({
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
