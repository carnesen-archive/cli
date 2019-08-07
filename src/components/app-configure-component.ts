import ora = require('ora');

import { targetProtocolPromptedInputComponent } from './target-protocol-input-component';
import { TargetProtocol } from '../util/target-protocol';
import { checkForDockerComponent } from './check-for-docker-component';
import { targetConfigFile, TARGET_CONFIG_FILE_NAME } from '../util/target-config-file';
import { targetHostnameInputComponent } from './target-hostname-input-component';
import { targetPathInputComponent } from './target-path-input-component';
import { writeAppConfigFileComponent } from './write-app-config-file-component';
import { writeAppPyFileComponent } from './write-app-py-file-component';
import { checkUserIsLoggedInComponent } from './check-user-is-logged-in-component';
import {
  DOCKER_HUB_EDGEIQ_REPOSITORY_NAME,
  DOCKER_FALLBACK_TAG_NAME,
} from '../constants';
import { writeDockerfileComponent } from './write-dockerfile-component';

const DOCKER_IMAGE_ID_INITIAL_VALUE = `${DOCKER_HUB_EDGEIQ_REPOSITORY_NAME}:${DOCKER_FALLBACK_TAG_NAME}`;

export async function appConfigureComponent(props: {
  yes: boolean;
  targetProtocol: TargetProtocol;
  targetHostname: string;
  targetPath: string;
}) {
  const { yes } = props;
  await checkUserIsLoggedInComponent({ yes });
  await writeAppConfigFileComponent({ yes });
  await writeAppPyFileComponent();
  await writeDockerfileComponent();

  const targetProtocol = yes
    ? props.targetProtocol
    : await targetProtocolPromptedInputComponent({
        targetProtocol: props.targetProtocol,
      });

  switch (targetProtocol) {
    case 'docker:':
      await checkForDockerComponent();
      targetConfigFile.write({
        targetProtocol,
        dockerImageId: DOCKER_IMAGE_ID_INITIAL_VALUE,
      });
      ora(`Write ${TARGET_CONFIG_FILE_NAME}`).succeed();
      break;

    case 'ssh+docker:':
      const targetHostname = yes
        ? props.targetHostname
        : await targetHostnameInputComponent({
            yes,
            targetHostname: props.targetHostname,
          });

      await checkForDockerComponent({ targetHostname });

      const targetPath = await targetPathInputComponent({
        yes,
        targetHostname,
        targetPath: props.targetPath,
      });

      targetConfigFile.write({
        targetProtocol,
        targetHostname,
        targetPath,
        dockerImageId: DOCKER_IMAGE_ID_INITIAL_VALUE,
      });

      ora(`Write ${TARGET_CONFIG_FILE_NAME}`).succeed();
      break;

    default:
      throw new Error(`Unexpected target protocol ${targetProtocol}`);
  }
}
