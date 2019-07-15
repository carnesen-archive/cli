import ora = require('ora');

import { appConfigFile, APP_CONFIG_FILE_NAME } from '../util/app-config-file';

export async function writeAppConfigFileComponent() {
  if (!appConfigFile.exists()) {
    ora(`Write ${APP_CONFIG_FILE_NAME}`).succeed();
    appConfigFile.update(() => {});
  } else {
    ora(`Found ${APP_CONFIG_FILE_NAME}`).succeed();
  }
}
