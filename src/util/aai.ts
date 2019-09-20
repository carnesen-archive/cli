import { TerseError } from '@alwaysai/alwayscli';

import { echo } from './echo';
import { cli } from '../cli';
import { confirmPromptComponent } from '../components/confirm-prompt-component';

export async function aai(command: string, props: { yes?: boolean } = {}) {
  const { yes = false } = props;
  echo(`$ aai ${command}`);
  const argv = command.split(' ');
  const result = await cli(...argv);
  if (typeof result !== 'undefined') {
    echo(result);
  }
  const confirmed =
    yes ||
    (await confirmPromptComponent({
      message: `End of "${command}". Proceed?`,
    }));
  if (!confirmed) {
    throw new TerseError('User elected not to proceed');
  }
  echo();
}
