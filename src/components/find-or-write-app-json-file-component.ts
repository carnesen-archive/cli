import ora = require('ora');
import { TerseError } from '@alwaysai/alwayscli';
import { appConfigFile } from '../util/app-config-file';
import { APP_JSON_FILE_NAME } from '../constants';
import { confirmWriteFileComponent } from './confirm-write-file-component';
import { MissingFilePleaseRunAppConfigureMessage } from '../util/missing-file-please-run-app-configure-message';

const WRITE_MESSAGE = `Write ${APP_JSON_FILE_NAME}`;
const FOUND_MESSAGE = `Found ${APP_JSON_FILE_NAME}`;

export async function findOrWriteAppJsonFileComponent(props: {
  yes: boolean;
  weAreInAppConfigure: boolean;
}) {
  const { yes, weAreInAppConfigure } = props;
  if (appConfigFile.exists()) {
    ora(FOUND_MESSAGE).succeed();
  } else {
    // !exists
    if (yes && !weAreInAppConfigure) {
      throw new TerseError(MissingFilePleaseRunAppConfigureMessage(APP_JSON_FILE_NAME));
    }
    await confirmWriteFileComponent({
      yes,
      fileName: APP_JSON_FILE_NAME,
      description: 'Configuration file',
    });
    try {
      appConfigFile.initialize();
      ora(WRITE_MESSAGE).succeed();
    } catch (exception) {
      ora(WRITE_MESSAGE).fail();
      throw exception;
    }
  }
}
