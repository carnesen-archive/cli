import { createReadStream } from 'fs';

import { echo } from '../util/echo';
import { run } from '../util/spawner-base/run';
import { connectBySshComponent } from './connect-by-ssh-component';
import { PUBLIC_KEY_FILE_PATH, PUBLIC_KEY_FILE_PRETTY_PATH } from '../constants';
import logSymbols = require('log-symbols');

// The following shell script is derived from the openSSH utility "ssh-copy-id"
//   * Create the .ssh directory with appropriate permissions if it does not exist
//   * Append \n to authorized_keys if it exists but does not end in \n (?)
//   * Append to authorized_keys from stdin using cat
//   * Reset the security context (type) (extended attributes) of authorized_keys
const SHELL_SCRIPT_FOR_APPENDING_TO_AUTHORIZED_KEYS = `exec sh -c 'cd ; umask 077 ; mkdir -p .ssh && { [ -z "'\`tail -1c .ssh/authorized_keys 2>/dev/null\`'" ] || echo >> .ssh/authorized_keys ; } && cat >> .ssh/authorized_keys || exit 1 ; if type restorecon >/dev/null 2>&1 ; then restorecon -F .ssh .ssh/authorized_keys ; fi'`;

export async function setUpPasswordlessSshComponent(props: { targetHostname: string }) {
  echo('We need to set up your system to enable passwordless ssh.');
  echo(`Please enter the ssh password for "${props.targetHostname}" when prompted.`);
  try {
    await run({
      exe: 'ssh',
      args: [
        '-o',
        'StrictHostKeyChecking=no',
        props.targetHostname,
        SHELL_SCRIPT_FOR_APPENDING_TO_AUTHORIZED_KEYS,
      ],
      input: createReadStream(PUBLIC_KEY_FILE_PATH),
    });
    echo(
      `${logSymbols.success} Copy "${PUBLIC_KEY_FILE_PRETTY_PATH}" to authorized_keys`,
    );
  } catch (exception) {
    echo(`${logSymbols.error} Copy "${PUBLIC_KEY_FILE_PRETTY_PATH}" to authorized_keys`);
    throw exception;
  }
  await connectBySshComponent({
    targetHostname: props.targetHostname,
  });
}
