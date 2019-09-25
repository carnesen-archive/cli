import { cli } from '../cli';
import { runWithEchoAndProceedPrompt } from './run-with-echo-and-proceed-prompt';

export async function aai(command: string, props: { yes?: boolean } = {}) {
  const { yes = false } = props;
  const argv = command.split(' ');
  await runWithEchoAndProceedPrompt(cli, argv, { yes, functionName: 'aai' });
}
