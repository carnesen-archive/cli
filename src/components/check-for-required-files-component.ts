import { existsSync } from 'fs';

import { appConfigFile, APP_CONFIG_FILE_NAME } from '../util/app-config-file';
import { targetConfigFile, TARGET_CONFIG_FILE_NAME } from '../util/target-config-file';
import { APP_DOT_PY } from '../constants';
import { appConfigureComponent } from './app-configure-component';
import { TerseError } from '@alwaysai/alwayscli';
import ora = require('ora');

export async function checkForRequiredFilesComponent(props: { yes: boolean }) {
  const { yes } = props;

  const spinner = ora('Check for required files').start();
  let titleOfMissingFile = '';
  if (!titleOfMissingFile && !appConfigFile.exists()) {
    titleOfMissingFile = `Application configuration file "${APP_CONFIG_FILE_NAME}"`;
  }

  if (!titleOfMissingFile && !targetConfigFile.exists()) {
    titleOfMissingFile = `Target configuration file "${TARGET_CONFIG_FILE_NAME}"`;
  }

  if (!titleOfMissingFile && !existsSync(APP_DOT_PY)) {
    titleOfMissingFile = `Python application file "${APP_DOT_PY}"`;
  }

  if (titleOfMissingFile) {
    if (yes) {
      spinner.fail();
      throw new TerseError(
        `${titleOfMissingFile} not found. Please run "alwaysai app configure".`,
      );
    } else {
      spinner.warn(`${titleOfMissingFile} not found`);
      await appConfigureComponent({
        yes,
        targetPath: '',
        targetHostname: '',
        targetProtocol: 'ssh+docker:',
      });
    }
  } else {
    spinner.succeed();
  }
}