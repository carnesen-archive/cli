import { platform } from 'os';

import { TargetProtocol } from '../util/target-protocol';
import { destinationPromptComponent, Destination } from './destination-prompt-component';

export async function targetProtocolPromptComponent(props: {
  targetProtocol?: TargetProtocol;
  nodejsPlatform?: NodeJS.Platform;
}) {
  const { targetProtocol, nodejsPlatform = platform() } = props;
  let answer: TargetProtocol | undefined;
  switch (nodejsPlatform) {
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

    case 'win32': {
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
      break;
    }

    default: {
      // Presumably we are on Mac OS. Might be something exotic.
      answer = TargetProtocol['ssh+docker:'];
    }
  }

  return answer;
}
