import { CliUsageError } from '@alwaysai/alwayscli';
import { TargetProtocol } from '../util/target-protocol';
import {
  PLEASE_REPORT_THIS_ERROR_MESSAGE,
  ALWAYSAI_DESKTOP_SOFTWARE_NAME,
  DOCKER_IMAGE_ID_INITIAL_VALUE,
} from '../constants';
import { findOrWriteDockerfileComponent } from './find-or-write-dockerfile-component';
import { RequiredWithYesMessage } from '../util/required-with-yes-message';
import { targetJsonYesComponent } from './target-json-yes-component';
import { TargetPathDefaultValue } from '../util/target-path-default-value';
import { ALWAYSAI_HOME } from '../environment';
import { appConfigurePreliminaryStepsComponent } from './app-configure-preliminary-steps-component';
import { removeTargetJsonFileComponent } from './remove-target-json-file-component';

export async function appConfigureYesComponent(props: {
  targetProtocol?: TargetProtocol;
  targetHostname?: string;
  targetPath?: string;
}) {
  const yes = true;
  const { targetHostname, targetPath, targetProtocol } = props;

  switch (targetProtocol) {
    case undefined: {
      if (!ALWAYSAI_HOME) {
        throw new CliUsageError(
          `The --protocol option is required unless the environment variable ALWAYSAI_HOME is set to the location of an ${ALWAYSAI_DESKTOP_SOFTWARE_NAME} installation.`,
        );
      }
      if (targetHostname) {
        throw new CliUsageError(OnlyAllowedWithSshPlusDockerMessage('hostname'));
      }
      if (targetPath) {
        throw new CliUsageError(OnlyAllowedWithSshPlusDockerMessage('path'));
      }
      await removeTargetJsonFileComponent();
      break;
    }

    case 'docker:': {
      await appConfigurePreliminaryStepsComponent({ yes });
      await findOrWriteDockerfileComponent({ yes });
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
        throw new CliUsageError(
          RequiredWithYesMessage(
            'hostname',
            undefined,
            `If "protocol" is "${TargetProtocol['ssh+docker:']}"`,
          ),
        );
      }
      await appConfigurePreliminaryStepsComponent({ yes });
      await findOrWriteDockerfileComponent({ yes });
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
}

function OnlyAllowedWithSshPlusDockerMessage(optionName: string) {
  return `The --${optionName} option is only allowed with --yes for --protocol "${
    TargetProtocol['ssh+docker:']
  }"`;
}
