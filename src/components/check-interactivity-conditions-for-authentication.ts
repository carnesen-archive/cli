import { TerseError } from '@alwaysai/alwayscli';

import { getNonInteractiveStreamName } from '../util/prompt';

export function checkInteractivityConditionsForAuthentication(
  shortName: string,
  longName: string,
) {
  const nonInteractiveStreamName = getNonInteractiveStreamName();
  if (nonInteractiveStreamName) {
    throw new TerseError(
      `To run this command we need to know the ${longName} associated with your alwaysAI user account so that we can authenticate you with the alwaysAI cloud. We were about to prompt you to enter your ${longName}, but this shell is not fully interactive. ("${nonInteractiveStreamName}" is not a TTY.) You can re-run this command in a fully interactive shell, or you can pass in the "${shortName}" command-line option together with the "yes" flag, which disables interactive prompts.`,
    );
  }
}
