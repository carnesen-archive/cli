import ora = require('ora');
import { appConfigFile } from '../util/app-json-file';
import { APP_JSON_FILE_NAME } from '../constants';
import { confirmWriteFilePromptComponent } from './confirm-write-file-prompt-component';
import { findOrWriteAppPyFileComponent } from './find-or-write-app-py-file-component';
import { TerseError } from '@alwaysai/alwayscli';
import { UnableToProceedWithoutMessage } from '../util/unable-to-proceed-without-message';

const WRITE_MESSAGE = `Write ${APP_JSON_FILE_NAME}`;
const FOUND_MESSAGE = `Found ${APP_JSON_FILE_NAME}`;

export async function findOrWriteAppJsonFileComponent(props: { yes: boolean }) {
  const { yes } = props;
  if (appConfigFile.exists()) {
    ora(FOUND_MESSAGE).succeed();
  } else {
    // !exists
    const confirmed =
      yes ||
      (await confirmWriteFilePromptComponent({
        fileName: APP_JSON_FILE_NAME,
        description: 'Configuration file',
      }));
    if (!confirmed) {
      throw new TerseError(UnableToProceedWithoutMessage(APP_JSON_FILE_NAME));
    }
    try {
      appConfigFile.initialize();
      ora(WRITE_MESSAGE).succeed();
    } catch (exception) {
      ora(WRITE_MESSAGE).fail();
      throw exception;
    }
    await findOrWriteAppPyFileComponent({ yes });
  }
}
