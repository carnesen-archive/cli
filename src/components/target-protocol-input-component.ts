import { platform } from 'os';
import { Choice } from 'prompts';

import { prompt, getNonInteractiveStreamName } from '../util/prompt';
import { UsageError } from '@alwaysai/alwayscli';
import { TargetProtocol } from '../util/target-protocol';

export async function targetProtocolInputComponent(props: {
  yes: boolean;
  targetProtocol?: TargetProtocol;
}) {
  const developerHostPlatform = platform();

  if (developerHostPlatform !== 'linux') {
    return TargetProtocol['ssh+docker:'];
  }

  if (props.yes) {
    if (!props.targetProtocol) {
      throw new UsageError(
        'The command-line option "protocol" is required if you\'ve passed the "yes" flag, which disables interactive prompts.',
      );
    }
    return props.targetProtocol;
  }

  const nonInteractiveStreamName = getNonInteractiveStreamName();
  if (nonInteractiveStreamName) {
    throw new UsageError(
      `We were about to prompt you to choose whether you want to run your application here on this computer or on a remote device, but this shell is not fully interactive. ("${nonInteractiveStreamName}" is not a TTY.) You can re-run this command in a fully interactive shell, or you can provide the "protocol" command-line option together with the "yes" flag, which disables interactive prompts.`,
    );
  }

  const choices: Choice[] = [
    { title: 'Your local computer', value: TargetProtocol['docker:'] },
    {
      title: 'Remote device',
      value: TargetProtocol['ssh+docker:'],
    },
  ];

  const initial = choices.findIndex(choice => choice.value === props.targetProtocol);
  if (initial === -1) {
    throw new Error(`Unexpected protocol "${props.targetProtocol}"`);
  }

  const answer = await prompt([
    {
      type: 'select',
      name: 'protocol',
      message: 'What is the destination?',
      initial,
      choices,
    },
  ]);

  const protocol: TargetProtocol = answer.protocol;
  return protocol;
}
