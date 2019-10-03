import { TargetProtocol } from '../util/target-protocol';
import { targetJsonPromptComponent } from './target-json-prompt-component';
import { ALWAYSAI_HOME, ALWAYSAI_OS_PLATFORM } from '../environment';
import { destinationPromptComponent, Destination } from './destination-prompt-component';
import { PLEASE_REPORT_THIS_ERROR_MESSAGE } from '../constants';
import { appConfigurePreliminaryStepsComponent } from './app-configure-preliminary-steps-component';
import { removeTargetJsonFileComponent } from './remove-target-json-file-component';

export async function appConfigurePromptComponent(props: {
  targetProtocol?: TargetProtocol;
  targetHostname?: string;
  targetPath?: string;
}) {
  const yes = false;
  const { targetHostname, targetPath, targetProtocol } = props;
  await appConfigurePreliminaryStepsComponent({ yes });
  switch (ALWAYSAI_OS_PLATFORM) {
    case 'linux': {
      // Note: We do not yet support ALWAYSAI_HOME on linux
      await targetJsonPromptComponent({
        targetProtocol,
        targetHostname,
        targetPath,
      });
      break;
    }

    case 'win32':
    case 'darwin':
    default: {
      if (!ALWAYSAI_HOME) {
        await targetJsonPromptComponent({
          targetProtocol,
          targetHostname,
          targetPath,
        });
      } else {
        // ALWAYSAI_HOME is defined
        const destination = await destinationPromptComponent({
          destination:
            targetProtocol === TargetProtocol['ssh+docker:']
              ? Destination.REMOTE_DEVICE
              : Destination.YOUR_LOCAL_COMPUTER,
        });
        switch (destination) {
          case Destination.YOUR_LOCAL_COMPUTER: {
            await removeTargetJsonFileComponent();
            break;
          }
          case Destination.REMOTE_DEVICE: {
            await targetJsonPromptComponent({
              targetProtocol,
              targetHostname,
              targetPath,
            });
            break;
          }
          default: {
            throw new Error(
              `Unexpected destination "${destination}". ${PLEASE_REPORT_THIS_ERROR_MESSAGE}`,
            );
          }
        }
      }
    }
  }
}
