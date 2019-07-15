import ora = require('ora');
import { TerseError } from '@alwaysai/alwayscli';

import { echo } from '../util/echo';
import { execFile } from 'child_process';
import { promisify } from 'util';
const OPENSSH = 'OpenSSH';

export async function checkForOpensshComponent() {
  const spinner = ora(`Check for OpenSSH-compatible ssh client`).start();
  spinner.start();
  try {
    // Note: ssh -V writes the version string to stderr, not stdout
    const output = await promisify(execFile)('ssh', ['-V'], { encoding: 'utf8' });
    if (!output.stderr.startsWith(OPENSSH)) {
      throw new Error(
        `Expected the command "ssh -V" to write a string "${OPENSSH}..." to stderr. Instead got "${
          output.stderr
        }" for stderr and "${output.stdout} for stdout"`,
      );
    }
    spinner.succeed();
  } catch (ex) {
    spinner.fail('Command "ssh -V" failed');
    echo(ex.message);
    echo();
    echo(
      `Please install the ${OPENSSH} suite of secure networking utilities, and make sure that its executables are available on your PATH.`,
    );
    echo();
    throw new TerseError(
      'Command "ssh -V" either failed or did not produce the expected result',
    );
  }
}
