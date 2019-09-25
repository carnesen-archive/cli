import { targetProtocolPromptComponent } from './target-protocol-prompt-component';
import { TargetProtocol } from '../util/target-protocol';
import { checkForDockerComponent } from './check-for-docker-component';
import { TargetJsonFile } from '../util/target-json-file';
import { targetHostnamePromptComponent } from './target-hostname-prompt-component';
import { targetPathPromptComponent } from './target-path-prompt-component';
import { DOCKER_IMAGE_ID_INITIAL_VALUE } from '../constants';
import { writeTargetJsonFileComponent } from './write-target-json-file-component';
import { findOrWritePrivateKeyFileComponent } from './find-or-write-private-key-file-component';
import { findOrWriteDockerfileComponent } from './find-or-write-dockerfile-component';
import { platform } from 'os';

export async function targetJsonPromptComponent(
  props: {
    targetProtocol?: TargetProtocol;
    targetHostname?: string;
    targetPath?: string;
    osPlatform?: NodeJS.Platform;
  } = {},
) {
  const yes = false;
  const { osPlatform = platform() } = props;
  const currentTargetJson = TargetJsonFile().readIfExists();
  const targetProtocol = await targetProtocolPromptComponent({
    osPlatform,
    targetProtocol:
      props.targetProtocol || (currentTargetJson && currentTargetJson.targetProtocol),
  });

  switch (targetProtocol) {
    case 'docker:':
      await checkForDockerComponent();
      await findOrWriteDockerfileComponent({ yes });
      writeTargetJsonFileComponent({
        targetProtocol,
        dockerImageId: DOCKER_IMAGE_ID_INITIAL_VALUE,
      });
      break;

    case 'ssh+docker:':
      await findOrWriteDockerfileComponent({ yes });
      await findOrWritePrivateKeyFileComponent({ yes });
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
