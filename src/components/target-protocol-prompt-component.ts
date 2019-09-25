import { platform } from 'os';

import { TargetProtocol } from '../util/target-protocol';
import { destinationPromptComponent, Destination } from './destination-prompt-component';

export async function targetProtocolPromptComponent(props: {
  targetProtocol?: TargetProtocol;
  osPlatform?: NodeJS.Platform;
}) {
  const { targetProtocol, osPlatform = platform() } = props;
  let answer: TargetProtocol;
  switch (osPlatform) {
    case 'linux': {
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
      answer = TargetProtocol['ssh+docker:'];
    }
  }

  return answer;
}
