import { platform } from 'os';

import { TargetProtocol } from '../util/target-protocol';
import { destinationPromptComponent, Destination } from './destination-prompt-component';
import { ALWAYSAI_HOME } from '../environment';

export async function targetProtocolPromptComponent(props: {
  targetProtocol?: TargetProtocol;
  nodejsPlatform?: NodeJS.Platform;
}) {
  const { targetProtocol, nodejsPlatform = platform() } = props;
  let answer: TargetProtocol | undefined;
  switch (nodejsPlatform) {
    case 'linux': {
      // Note: This implementation does not support ALWAYSAI_HOME on linux
      const destination = await destinationPromptComponent({
        destination:
          targetProtocol === TargetProtocol['ssh+docker:']
            ? Destination.REMOTE_DEVICE
            : Destination.YOUR_LOCAL_COMPUTER,
      });
      answer =
        destination === Destination.REMOTE_DEVICE
          ? TargetProtocol['ssh+docker:']
          : TargetProtocol['docker:'];
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
        answer =
          destination === Destination.REMOTE_DEVICE
            ? TargetProtocol['ssh+docker:']
            : undefined;
      } else {
        answer = TargetProtocol['ssh+docker:'];
      }
    }
  }

  return answer;
}
