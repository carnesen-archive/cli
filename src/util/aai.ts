import { CliArgvInterface } from '@alwaysai/alwayscli';
import { root } from '../root';
import { runWithEchoAndProceedPrompt } from './run-with-echo-and-proceed-prompt';

const argvInterface = CliArgvInterface(root);

export async function aai(argvString: string, props: { yes?: boolean } = {}) {
  const { yes = false } = props;
  const argv = argvString.split(' ');
  await runWithEchoAndProceedPrompt(argvInterface, argv, { yes, functionName: 'aai' });
}
