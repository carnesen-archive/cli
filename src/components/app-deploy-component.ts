import logSymbols = require('log-symbols');
import { appConfigFile, APP_CONFIG_FILE_NAME } from '../util/app-config-file';
import { targetConfigFile, TARGET_CONFIG_FILE_NAME } from '../util/target-config-file';
import { JsSpawner } from '../spawner/js-spawner';
import { AppInstaller } from '../app-installer';
import { spinOnPromise } from '../util/spin-on-promise';
import { echo } from '../util/echo';
import { existsSync } from 'fs';
import { APP_DOT_PY } from '../constants';
import { appConfigureComponent } from './app-configure-component';
import { TargetProtocol } from '../util/target-protocol';
import { alwaysaiUserLoginComponent } from './alwaysai-user-login-component';

export async function appDeployComponent(props: {
  yes: boolean;
  alwaysaiUserEmail?: string;
  alwaysaiUserPassword?: string;
  targetProtocol?: TargetProtocol;
  targetHostname?: string;
  targetPath?: string;
}) {
  await alwaysaiUserLoginComponent({
    yes: props.yes,
    alwaysaiUserEmail: props.alwaysaiUserEmail,
    alwaysaiUserPassword: props.alwaysaiUserPassword,
  });
  {
    let titleOfMissingFile = '';
    if (!titleOfMissingFile && !appConfigFile.exists()) {
      titleOfMissingFile = `application configuration file "${APP_CONFIG_FILE_NAME}"`;
    }

    if (!titleOfMissingFile && !targetConfigFile.exists()) {
      titleOfMissingFile = `target configuration file "${TARGET_CONFIG_FILE_NAME}"`;
    }

    if (!titleOfMissingFile && !existsSync(APP_DOT_PY)) {
      titleOfMissingFile = `python application file "${APP_DOT_PY}"`;
    }
    if (titleOfMissingFile) {
      echo(
        `We're going to run the "app configure" steps because the ${titleOfMissingFile} does not exist.`,
      );
      await appConfigureComponent(props);
    }
  }
  const appConfig = appConfigFile.read();
  const targetSpawner = targetConfigFile.readSpawner();
  const targetConfig = targetConfigFile.read();
  const sourceSpawner = JsSpawner();
  await targetSpawner.mkdirp();

  const appInstaller = AppInstaller(targetSpawner);

  // Protocol-specific installation steps
  switch (targetConfig.protocol) {
    case 'ssh+docker:': {
      await spinOnPromise(
        appInstaller.installSource(sourceSpawner),
        'Copy application to target',
      );
    }
  }

  let hasModels = false;
  if (appConfig.models) {
    const ids = Object.keys(appConfig.models);
    if (ids.length > 0) {
      hasModels = true;
      await spinOnPromise(
        appInstaller.installModels(appConfig.models),
        `Model${ids.length > 1 ? 's' : ''} ${ids.join(' ')}`,
      );
    }
  }

  if (!hasModels) {
    echo(`${logSymbols.warning} Application has no models`);
  }

  await spinOnPromise(appInstaller.installVirtualenv(), 'Install python virtualenv');
  await spinOnPromise(appInstaller.installPythonDeps(), 'Install python dependencies');
}
