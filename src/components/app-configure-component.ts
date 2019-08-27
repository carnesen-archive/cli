import { TargetProtocol } from '../util/target-protocol';
import {
  DOCKER_HUB_EDGEIQ_REPOSITORY_NAME,
  DOCKER_FALLBACK_TAG_NAME,
  THIS_SHOULD_NEVER_HAPPEN_MESSAGE,
} from '../constants';
import { UsageError } from '@alwaysai/alwayscli';
import { RequiredWithYesMessage } from '../util/required-with-yes-message';
import { targetJsonYesComponent } from './target-json-yes-component';
import { targetJsonPromptComponent } from './target-json-prompt-component';
import { appConfigurePreliminaryStepsComponent } from './app-configure-preliminary-steps-component';

const DOCKER_IMAGE_ID_INITIAL_VALUE = `${DOCKER_HUB_EDGEIQ_REPOSITORY_NAME}:${DOCKER_FALLBACK_TAG_NAME}`;

export async function appConfigureComponent(props: {
  yes: boolean;
  targetProtocol?: TargetProtocol;
  targetHostname?: string;
  targetPath?: string;
}) {
  const { yes, targetHostname, targetPath, targetProtocol } = props;
  await appConfigurePreliminaryStepsComponent({ yes: false, weAreInAppConfigure: true });

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
          weAreInAppConfigure: true,
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
          weAreInAppConfigure: true,
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
