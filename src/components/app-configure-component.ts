import { TargetProtocol } from '../util/target-protocol';
import {
  DOCKER_EDGEIQ_REPOSITORY_NAME,
  DOCKER_FALLBACK_TAG_NAME,
  PLEASE_REPORT_THIS_ERROR_MESSAGE,
} from '../constants';
import { UsageError } from '@alwaysai/alwayscli';
import { findOrWriteAppJsonFileComponent } from './find-or-write-app-json-file-component';
import { checkUserIsLoggedInComponent } from './check-user-is-logged-in-component';
import { findOrWriteDockerfileComponent } from './find-or-write-dockerfile-component';
import { RequiredWithYesMessage } from '../util/required-with-yes-message';
import { targetJsonYesComponent } from './target-json-yes-component';
import { targetJsonPromptComponent } from './target-json-prompt-component';
import { TargetPathDefaultValue } from '../util/target-path-default-value';

const DOCKER_IMAGE_ID_INITIAL_VALUE = `${DOCKER_EDGEIQ_REPOSITORY_NAME}:${DOCKER_FALLBACK_TAG_NAME}`;

async function appConfigurePreliminaryStepsComponent(props: { yes: boolean }) {
  const { yes } = props;
  await checkUserIsLoggedInComponent({ yes });
  await findOrWriteAppJsonFileComponent({ yes });
  await findOrWriteDockerfileComponent({ yes });
}

export async function appConfigureComponent(props: {
  yes: boolean;
  targetProtocol?: TargetProtocol;
  targetHostname?: string;
  targetPath?: string;
}) {
  const { yes, targetHostname, targetPath, targetProtocol } = props;

  if (yes) {
    switch (targetProtocol) {
      case undefined: {
        throw new UsageError(RequiredWithYesMessage('protocol'));
      }

      case 'docker:': {
        await appConfigurePreliminaryStepsComponent({ yes });
        await targetJsonYesComponent({
          targetJson: {
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
        await appConfigurePreliminaryStepsComponent({ yes });
        await targetJsonYesComponent({
          targetJson: {
            targetProtocol,
            targetHostname,
            targetPath: targetPath || TargetPathDefaultValue(),
            dockerImageId: DOCKER_IMAGE_ID_INITIAL_VALUE,
          },
        });
        break;
      }

      default: {
        throw new Error(PLEASE_REPORT_THIS_ERROR_MESSAGE);
      }
    }
  } else {
    // !yes: run the prompted interface
    await appConfigurePreliminaryStepsComponent({ yes });
    await targetJsonPromptComponent({
      targetHostname,
      targetPath,
      targetProtocol,
    });
  }
}
