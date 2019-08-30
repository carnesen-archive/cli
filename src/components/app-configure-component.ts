import { TargetProtocol } from '../util/target-protocol';
import {
  DOCKER_HUB_EDGEIQ_REPOSITORY_NAME,
  DOCKER_FALLBACK_TAG_NAME,
  THIS_SHOULD_NEVER_HAPPEN_MESSAGE,
} from '../constants';
import { UsageError } from '@alwaysai/alwayscli';
import { findOrWriteAppJsonFileComponent } from './find-or-write-app-json-file-component';
import { checkUserIsLoggedInComponent } from './check-user-is-logged-in-component';
import { findOrWriteDockerfileComponent } from './find-or-write-dockerfile-component';
import { RequiredWithYesMessage } from '../util/required-with-yes-message';
import { targetJsonYesComponent } from './target-json-yes-component';
import { targetJsonPromptComponent } from './target-json-prompt-component';

const DOCKER_IMAGE_ID_INITIAL_VALUE = `${DOCKER_HUB_EDGEIQ_REPOSITORY_NAME}:${DOCKER_FALLBACK_TAG_NAME}`;

export async function appConfigureComponent(props: {
  yes: boolean;
  targetProtocol?: TargetProtocol;
  targetHostname?: string;
  targetPath?: string;
}) {
  const { yes, targetHostname, targetPath, targetProtocol } = props;
  await checkUserIsLoggedInComponent({ yes });
  await findOrWriteAppJsonFileComponent({ yes });
  await findOrWriteDockerfileComponent({ yes });

  if (yes) {
    switch (targetProtocol) {
      case undefined: {
        throw new UsageError(RequiredWithYesMessage('protocol'));
      }

      case 'docker:': {
        await targetJsonYesComponent({
          targetConfig: {
            targetProtocol,
            dockerImageId: DOCKER_IMAGE_ID_INITIAL_VALUE,
          },
        });
        break;
      }

      case 'ssh+docker:': {
        if (!targetHostname) {
          throw new UsageError(
            RequiredWithYesMessage(
              'hostname',
              undefined,
              `If "protocol" is "${TargetProtocol['ssh+docker:']}"`,
            ),
          );
        }
        if (!targetPath) {
          throw new UsageError(
            RequiredWithYesMessage(
              'path',
              undefined,
              `If "protocol" is "${TargetProtocol['ssh+docker:']}"`,
            ),
          );
        }
        await targetJsonYesComponent({
          targetConfig: {
            targetProtocol,
            targetHostname,
            targetPath,
            dockerImageId: DOCKER_IMAGE_ID_INITIAL_VALUE,
          },
        });
        break;
      }

      default: {
        throw new Error(THIS_SHOULD_NEVER_HAPPEN_MESSAGE);
      }
    }
  } else {
    // !yes: run the prompted interface
    await targetJsonPromptComponent({
      targetHostname,
      targetPath,
      targetProtocol,
    });
  }
}
