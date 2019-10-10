import { CLI_TERSE_ERROR } from '@alwaysai/alwayscli';

import { promptForInput } from '../util/prompt-for-input';
import {
  connectBySshComponent,
  TIMED_OUT_CONNECTING_TO,
} from './connect-by-ssh-component';
import { PROCESS_EXITED_WITH_NON_ZERO_STATUS_CODE } from '../util/spawner-base/run';
import { echo } from '../util/echo';
import { setUpPasswordlessSshComponent } from './set-up-passwordless-ssh-component';

export async function targetHostnamePromptComponent(props: { targetHostname?: string }) {
  let targetHostname: string = props.targetHostname || '';
  let connected = false;
  while (!connected) {
    targetHostname = await promptForTargetHostname();
    try {
      await connectBySshComponent({
        targetHostname,
        warnOrFail: 'warn',
      });
      connected = true;
    } catch (exception) {
      if (
        exception &&
        exception.code === CLI_TERSE_ERROR &&
        typeof exception.message === 'string' &&
        (exception.message.includes(PROCESS_EXITED_WITH_NON_ZERO_STATUS_CODE) ||
          exception.message.includes(TIMED_OUT_CONNECTING_TO))
      ) {
        if (exception.message.includes('Permission denied')) {
          await setUpPasswordlessSshComponent({ targetHostname });
          connected = true;
        } else {
          echo(exception.message);
          echo('Cannot connect to your device. Please check the address and try again.');
        }
      } else {
        throw exception;
      }
    }
  }

  return targetHostname;

  async function promptForTargetHostname() {
    const answers = await promptForInput({
      purpose: 'for the target hostname',
      questions: [
        {
          type: 'text',
          name: 'hostname',
          message:
            'Please enter the hostname (with optional user name) to connect to your device via ssh (e.g. "pi@1.2.3.4"):',
          initial: targetHostname,
          validate: value => (!value ? 'Value is required' : true),
        },
      ],
    });
    return answers.hostname as string;
  }
}
