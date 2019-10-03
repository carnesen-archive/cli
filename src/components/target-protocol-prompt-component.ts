import { TargetProtocol } from '../util/target-protocol';
import { destinationPromptComponent, Destination } from './destination-prompt-component';
import { ALWAYSAI_OS_PLATFORM } from '../environment';

export async function targetProtocolPromptComponent(props: {
  targetProtocol?: TargetProtocol;
}) {
  const { targetProtocol } = props;
  let answer: TargetProtocol;
  switch (ALWAYSAI_OS_PLATFORM) {
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
