import ora = require('ora');
import delay = require('delay');
import { SshSpawner } from '../util/spawner/ssh-spawner';
import { TerseError } from '@alwaysai/alwayscli';

const TEN_SECONDS = 10 * 1000;
export const TIMED_OUT_CONNECTING_TO = 'Timed out connecting to';

export async function checkSshConnectivityComponent(props: {
  targetHostname: string;
  warnOrFail?: 'warn' | 'fail';
}) {
  const { targetHostname, warnOrFail = 'fail' } = props;
  const spinner = ora('Check SSH connectivity').start();
  const spawner = SshSpawner({ targetHostname });
  try {
    await Promise.race([
      spawner.run({ exe: 'echo' }),
      delay.reject(TEN_SECONDS, {
        value: new TerseError(`${TIMED_OUT_CONNECTING_TO} "${targetHostname}"`),
      }),
    ]);
    spinner.succeed();
  } catch (exception) {
    spinner[warnOrFail]();
    throw exception;
  }
}
