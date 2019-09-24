import { TerseError } from '@alwaysai/alwayscli';

import { echo, echoCommandInvocation } from './echo';
import { confirmPromptComponent } from '../components/confirm-prompt-component';
import chalk from 'chalk';
import logSymbols = require('log-symbols');

export async function runWithEchoAndProceedPrompt<TArgs extends any[]>(
  func: (...args: TArgs) => any,
  args: TArgs,
  props: { yes?: boolean } = {},
) {
  const { yes = false } = props;
  const commandString = `${func.name} ${args.join(' ')}`;
  echoCommandInvocation(commandString);
  const result = await func(...args);
  if (typeof result !== 'undefined') {
    echo(result);
  }
  const endOfCommandMessage = `End of "${commandString}"`;
  if (!yes) {
    const confirmed = await confirmPromptComponent({
      message: `${endOfCommandMessage}. Proceed?`,
    });
    if (!confirmed) {
      throw new TerseError('User elected not to proceed');
    }
  } else {
    echo(`${logSymbols.success} ${chalk.bold(endOfCommandMessage)}`);
  }
  echo();
}
