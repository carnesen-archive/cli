import prompts = require('prompts');
import { TerseError } from '@alwaysai/alwayscli';

type Questions<T extends string> = prompts.PromptObject<T>[];

function getNonInteractiveStreamName() {
  for (const streamName of ['stdin' as const, 'stdout' as const]) {
    if (!process[streamName].isTTY) {
      return streamName;
    }
  }
  return undefined;
}

export async function promptForInput<T extends string>(props: {
  purpose: string;
  alternative?: string;
  questions: Questions<T>;
}) {
  const {
    questions,
    purpose,
    alternative = 'use the --yes flag to disable interactive prompts',
  } = props;
  const streamName = getNonInteractiveStreamName();
  if (streamName) {
    throw new TerseError(
      `We were about to prompt you ${purpose}, but standard ${
        streamName === 'stdin' ? 'input' : 'output'
      } (${streamName}) is not a TTY. Please re-run this command in a fully interactive terminal, or ${alternative}.`,
    );
  }

  let canceled = false;
  const answers = await prompts(questions, {
    onCancel() {
      canceled = true;
    },
  });
  if (canceled) {
    throw new TerseError('Operation canceled by user');
  }
  return answers;
}
