import { TargetProtocol } from '../util/target-protocol';
import { platform } from 'os';
import { targetJsonPromptComponent } from './target-json-prompt-component';
import { ALWAYSAI_HOME } from '../environment';
import { destinationPromptComponent, Destination } from './destination-prompt-component';
import { TargetJsonFile } from '../util/target-json-file';
import { runWithSpinner } from '../util/run-with-spinner';
import { PLEASE_REPORT_THIS_ERROR_MESSAGE } from '../constants';

export async function appConfigurePromptComponent(props: {
  targetProtocol?: TargetProtocol;
  targetHostname?: string;
  targetPath?: string;
  osPlatform?: NodeJS.Platform;
}) {
  const { targetHostname, targetPath, targetProtocol, osPlatform = platform() } = props;

  switch (osPlatform) {
    case 'linux': {
      // Note: We do not yet support ALWAYSAI_HOME on linux
      await targetJsonPromptComponent({
        targetProtocol,
        targetHostname,
        targetPath,
        osPlatform,
      });
      break;
    }

    case 'win32':
    case 'darwin':
    default: {
      if (ALWAYSAI_HOME) {
        const destination = await destinationPromptComponent({
          destination:
            targetProtocol === TargetProtocol['ssh+docker:']
              ? Destination.REMOTE_DEVICE
              : Destination.YOUR_LOCAL_COMPUTER,
        });
        switch (destination) {
          case Destination.YOUR_LOCAL_COMPUTER: {
            const targetJsonFile = TargetJsonFile();
            if (targetJsonFile.exists()) {
              runWithSpinner(
                targetJsonFile.remove,
                [],
                'Remove target configuration file',
              );
            }
            break;
          }
          case Destination.REMOTE_DEVICE: {
            await targetJsonPromptComponent({
              targetProtocol,
              targetHostname,
              targetPath,
              osPlatform,
            });
            break;
          }
          default: {
            throw new Error(
              `Unexpected destination. ${PLEASE_REPORT_THIS_ERROR_MESSAGE}`,
            );
          }
        }
      }
    }
  }
}
