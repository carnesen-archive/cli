import { CliTerseError } from '@alwaysai/alwayscli';

import { echo, echoCommandInvocation } from './echo';
import { confirmPromptComponent } from '../components/confirm-prompt-component';
import chalk from 'chalk';
import logSymbols = require('log-symbols');

export async function runWithEchoAndProceedPrompt<TArgs extends any[]>(
  func: (...args: TArgs) => any,
  args: TArgs,
  props: { yes?: boolean; functionName?: string } = {},
) {
  const { yes = false, functionName } = props;
  const commandString = `${functionName || func.name} ${args.join(' ')}`;
  echoCommandInvocation(commandString);
  const result = await func(...args);
  let endOfCommandMessage = `End of "${commandString}"`;
  if (typeof result !== 'undefined') {
    endOfCommandMessage = `${endOfCommandMessage} (result=${result})`;
  }
  if (!yes) {
    const confirmed = await confirmPromptComponent({
      message: `${endOfCommandMessage}. Proceed?`,
    });
    if (!confirmed) {
      throw new CliTerseError('User elected not to proceed');
    }
  } else {
    echo(`${logSymbols.success} ${chalk.bold(endOfCommandMessage)}`);
  }
  echo();
}
