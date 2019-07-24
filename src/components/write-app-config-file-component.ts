import ora = require('ora');

import { appConfigFile, APP_CONFIG_FILE_NAME } from '../util/app-config-file';
import { prompt } from '../util/prompt';
import { TerseError } from '@alwaysai/alwayscli';

export async function writeAppConfigFileComponent(props: { yes: boolean }) {
  if (!appConfigFile.exists()) {
    let confirmed = true;
    if (!props.yes) {
      const answers = await prompt([
        {
          type: 'confirm',
          name: 'confirmed',
          message:
            'Do you want to initialize your current working directory as an alwaysAI application?',
          initial: true,
        },
      ]);
      ({ confirmed } = answers);
    }
    if (!confirmed) {
      throw new TerseError('This directory is not an alwaysAI application');
    }
    ora(`Write ${APP_CONFIG_FILE_NAME}`).succeed();
    appConfigFile.update(() => {});
  } else {
    ora(`Found ${APP_CONFIG_FILE_NAME}`).succeed();
  }
}
