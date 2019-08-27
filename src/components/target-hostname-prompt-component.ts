import { TERSE } from '@alwaysai/alwayscli';

import { prompt } from '../util/prompt';
import {
  checkSshConnectivityComponent,
  TIMED_OUT_CONNECTING_TO,
} from './check-ssh-connectivity-component';
import { PROCESS_EXITED_WITH_NON_ZERO_STATUS_CODE } from '../spawner/spawner-base/run';
import { echo } from '../util/echo';
import { setUpPasswordlessSshComponent } from './set-up-passwordless-ssh-component';

export async function targetHostnamePromptComponent(props: { targetHostname?: string }) {
  let targetHostname: string = props.targetHostname || '';
  let connected = false;
  while (!connected) {
    targetHostname = await promptForTargetHostname();
    try {
      await checkSshConnectivityComponent({
        targetHostname,
        warnOrFail: 'warn',
      });
      connected = true;
    } catch (exception) {
      if (
        exception &&
        exception.code === TERSE &&
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
    const answer = await prompt([
      {
        type: 'text',
        name: 'hostname',
        message:
          'Please enter the hostname (with optional user name) to connect to your device via ssh (e.g. "pi@1.2.3.4"):',
        initial: targetHostname,
        validate: value => (!value ? 'Value is required' : true),
      },
    ]);
    return answer.hostname as string;
  }
}
