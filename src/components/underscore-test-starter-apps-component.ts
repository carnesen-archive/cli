import * as t from 'io-ts';
import { ALWAYSAI_STARTER_APPS } from '../constants';
import { readdirSync, existsSync } from 'fs';
import { echo } from '../util/echo';
import { appStartComponent } from './app-start-component';
import rimraf = require('rimraf');
import { ConfigFile } from '@alwaysai/config-nodejs';
import { confirmPromptComponent } from './confirm-prompt-component';
import { modelPackageCache } from '../util/model-package-cache';
import { aai } from '../util/aai';
import { TargetProtocol } from '../util/target-protocol';

const TESTED_STARTER_APPS_JSON_FILE_NAME = 'alwaysai.tested-starter-apps.json';

export async function underscoreTestStarterAppsComponent(props: {
  targetHostname?: string;
  reset: boolean;
}) {
  const { targetHostname, reset } = props;
  const targetProtocol = targetHostname
    ? TargetProtocol['ssh+docker:']
    : TargetProtocol['docker:'];

  if (reset) {
    echo(`rm -rf ${ALWAYSAI_STARTER_APPS}`);
    rimraf.sync(ALWAYSAI_STARTER_APPS);
    echo('clear model package cache');
    await modelPackageCache.clear();
  }

  if (!existsSync(ALWAYSAI_STARTER_APPS)) {
    await aai('get-starter-apps');
  }

  const jsonFile = ConfigFile({
    path: TESTED_STARTER_APPS_JSON_FILE_NAME,
    codec: t.record(t.string, t.boolean),
    initialValue: {},
  });
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
      );
      await aai('app models update');
      await aai('app deploy');
      echo('$ aai app start');
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
