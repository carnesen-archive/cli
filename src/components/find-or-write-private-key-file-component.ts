import { existsSync, writeFileSync } from 'fs';
import { execFile } from 'child_process';
import { promisify } from 'util';
import ora = require('ora');
import { TerseError } from '@alwaysai/alwayscli';

import {
  PRIVATE_KEY_FILE_PRETTY_PATH,
  PRIVATE_KEY_FILE_PATH,
  PUBLIC_KEY_FILE_PATH,
  PUBLIC_KEY_FILE_PRETTY_PATH,
} from '../constants';
import { confirmWriteFileComponent } from './confirm-write-file-component';
import { MissingFilePleaseRunAppConfigureMessage } from '../util/missing-file-please-run-app-configure-message';

const WRITE_MESSAGE = `Write ${PRIVATE_KEY_FILE_PRETTY_PATH}`;
const FOUND_MESSAGE = `Found ${PRIVATE_KEY_FILE_PRETTY_PATH}`;

export async function findOrWritePrivateKeyFileComponent(props: {
  yes: boolean;
  weAreInAppConfigure: boolean;
}) {
  const { yes, weAreInAppConfigure } = props;
  if (existsSync(PRIVATE_KEY_FILE_PATH)) {
    ora(FOUND_MESSAGE).succeed();

    // Make sure that the public part of the key is in place. It should be if it
    // was created with ssh-keygen. It might not be if the private key was
    // copied to this host from elsewhere.
    if (!existsSync(PUBLIC_KEY_FILE_PATH)) {
      await confirmWriteFileComponent({
        yes,
        fileName: PUBLIC_KEY_FILE_PRETTY_PATH,
        description: 'Public key file',
      });
      const spinner = ora().start(`Write ${PUBLIC_KEY_FILE_PRETTY_PATH}`);
      try {
        const { stdout } = await promisify(execFile)('ssh-keygen', [
          '-y',
          '-f',
          PRIVATE_KEY_FILE_PATH,
        ]);
        await writeFileSync(PUBLIC_KEY_FILE_PATH, stdout, { flag: 'wx' });
        spinner.succeed();
      } catch (exception) {
        if (exception.code === 'EEXIST') {
          // Unlikely scenario that the file did not exist but now does
        } else {
          throw exception;
        }
      }
    }
  } else {
    // !exists
    if (yes && !weAreInAppConfigure) {
      throw new TerseError(
        MissingFilePleaseRunAppConfigureMessage(PRIVATE_KEY_FILE_PRETTY_PATH),
      );
    }
    await confirmWriteFileComponent({
      yes,
      fileName: PRIVATE_KEY_FILE_PRETTY_PATH,
      description: 'Private key file',
    });
    // ssh-keygen creates the private key file and the corresponding .pub file
    const spinner = ora(WRITE_MESSAGE).start();
    try {
      await promisify(execFile)('ssh-keygen', [
        '-q',
        '-b',
        '2048',
        '-t',
        'rsa',
        '-N',
        '',
        '-C',
        'Generated by alwaysAI CLI',
        '-f',
        PRIVATE_KEY_FILE_PATH,
      ]);
      spinner.succeed();
    } catch (exception) {
      spinner.fail();
      throw exception;
    }
  }
}
