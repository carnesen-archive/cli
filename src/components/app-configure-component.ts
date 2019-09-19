import { UsageError } from '@alwaysai/alwayscli';
import { platform } from 'os';
import { TargetProtocol } from '../util/target-protocol';
import {
  DOCKER_EDGEIQ_REPOSITORY_NAME,
  DOCKER_FALLBACK_TAG_NAME,
  PLEASE_REPORT_THIS_ERROR_MESSAGE,
} from '../constants';
import { findOrWriteAppJsonFileComponent } from './find-or-write-app-json-file-component';
import { checkUserIsLoggedInComponent } from './check-user-is-logged-in-component';
import { findOrWriteDockerfileComponent } from './find-or-write-dockerfile-component';
import { RequiredWithYesMessage } from '../util/required-with-yes-message';
import { targetJsonYesComponent } from './target-json-yes-component';
import { targetJsonPromptComponent } from './target-json-prompt-component';
import { TargetPathDefaultValue } from '../util/target-path-default-value';
import { TargetJsonFile } from '../util/target-json-file';
import { runWithSpinner } from '../util/run-with-spinner';

const DOCKER_IMAGE_ID_INITIAL_VALUE = `${DOCKER_EDGEIQ_REPOSITORY_NAME}:${DOCKER_FALLBACK_TAG_NAME}`;

async function appConfigurePreliminaryStepsComponent(props: { yes: boolean }) {
  const { yes } = props;
  await checkUserIsLoggedInComponent({ yes });
  await findOrWriteAppJsonFileComponent({ yes });
  await findOrWriteDockerfileComponent({ yes });
}

export async function appConfigureComponent(props: {
  yes: boolean;
  nodejsPlatform?: NodeJS.Platform;
  targetProtocol?: TargetProtocol;
  targetHostname?: string;
  targetPath?: string;
}) {
  const {
    yes,
    targetHostname,
    targetPath,
    targetProtocol,
    nodejsPlatform = platform(),
  } = props;

  if (yes) {
    switch (targetProtocol) {
      case undefined: {
        if (nodejsPlatform !== 'win32') {
          throw new UsageError(
            `The --protocol option is required on your current operating system platform "${nodejsPlatform}"`,
          );
        }
        if (targetHostname) {
          throw new UsageError(OnlyAllowedWithSshPlusDockerMessage('hostname'));
        }
        if (targetPath) {
          throw new UsageError(OnlyAllowedWithSshPlusDockerMessage('path'));
        }
        const targetJsonFile = TargetJsonFile();
        if (targetJsonFile.exists()) {
          runWithSpinner(targetJsonFile.remove, [], 'Remove target configuration file');
        }
        break;
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
      nodejsPlatform,
      targetProtocol,
      targetHostname,
      targetPath,
    });
  }
}

function OnlyAllowedWithSshPlusDockerMessage(optionName: string) {
  return `The --${optionName} option is only allowed with --yes for --protocol "${
    TargetProtocol['ssh+docker:']
  }"`;
}
