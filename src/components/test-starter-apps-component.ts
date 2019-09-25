import * as t from 'io-ts';
import {
  ALWAYSAI_STARTER_APPS,
  VENV,
  PRIVATE_KEY_FILE_PRETTY_PATH,
  PRIVATE_KEY_FILE_PATH,
} from '../constants';
import { readdirSync, existsSync } from 'fs';
import { echo } from '../util/echo';
import { appStartComponent } from './app-start-component';
import rimraf = require('rimraf');
import { ConfigFile } from '@alwaysai/config-nodejs';
import { confirmPromptComponent } from './confirm-prompt-component';
import { modelPackageCache } from '../util/model-package-cache';
import { aai } from '../util/aai';
import { TargetProtocol } from '../util/target-protocol';
import { SshSpawner } from '../util/spawner/ssh-spawner';

const TESTED_STARTER_APPS_JSON_FILE_NAME = 'alwaysai.tested-starter-apps.json';

export async function underscoreTestStarterAppsComponent(props: {
  yes: boolean;
  targetHostname?: string;
  reset: boolean;
}) {
  const { yes, targetHostname, reset } = props;
  const targetProtocol = targetHostname
    ? TargetProtocol['ssh+docker:']
    : TargetProtocol['docker:'];

  const jsonFile = ConfigFile({
    path: TESTED_STARTER_APPS_JSON_FILE_NAME,
    codec: t.record(t.string, t.boolean),
    initialValue: {},
  });

  if (reset) {
    echo(`$ rm -rf ${PRIVATE_KEY_FILE_PRETTY_PATH}`);
    rimraf.sync(PRIVATE_KEY_FILE_PATH);
    echo(`$ rm -rf ${TESTED_STARTER_APPS_JSON_FILE_NAME}`);
    jsonFile.remove();
    echo(`$ rm -rf ${ALWAYSAI_STARTER_APPS}`);
    rimraf.sync(ALWAYSAI_STARTER_APPS);
    echo('clear model package cache');
    await modelPackageCache.clear();
    if (targetHostname) {
      echo('rimraf "~/alwaysai" on target host');
      const targetHostSpawner = SshSpawner({ targetHostname });
      await targetHostSpawner.rimraf('alwaysai');
    } else {
      echo('$ rm -rf models');
      rimraf.sync('models');
      echo(`$ rm -rf ${VENV}`);
      rimraf.sync(VENV);
    }
  }

  if (!existsSync(ALWAYSAI_STARTER_APPS)) {
    await aai('get-starter-apps', { yes });
  }

  jsonFile.initialize();

  process.chdir(ALWAYSAI_STARTER_APPS);
  for (const fileName of readdirSync('.')) {
    echo(`$ cd ${fileName}`);
    process.chdir(fileName);
    const tested = jsonFile.read()[fileName];
    if (!tested) {
      await aai(
        `app configure --yes --protocol ${targetProtocol}${
          targetHostname ? ` --hostname ${targetHostname}` : ''
        }`,
        { yes },
      );
      await aai('app models update', { yes });
      await aai('app deploy', { yes });
      echo('$ aai app start', { yes });
      const exitCode = await appStartComponent({ superuser: true });
      echo(`"app start" exited with code ${exitCode}`);
      const confirmed = await confirmPromptComponent({
        message: 'Mark this starter app as "tested"?',
      });
      jsonFile.update(testedJson => {
        testedJson[fileName] = confirmed;
      });
    }
    process.chdir('..');
  }
  process.chdir('..');
}
