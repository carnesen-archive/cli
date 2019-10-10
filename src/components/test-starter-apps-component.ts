import * as t from 'io-ts';
import {
  ALWAYSAI_STARTER_APPS,
  PRIVATE_KEY_FILE_PRETTY_PATH,
  PRIVATE_KEY_FILE_PATH,
  MODEL_PACKAGE_CACHE_DIR,
} from '../constants';
import { readdirSync, existsSync } from 'fs';
import { echoCommandInvocation } from '../util/echo';
import rimraf = require('rimraf');
import { ConfigFile } from '@alwaysai/config-nodejs';
import { modelPackageCache } from '../util/model-package-cache';
import { aai } from '../util/aai';
import { testAppComponent } from './test-app-component';
import { cd } from '../util/cd';
import { getSystemId } from '../util/system-id';

const TESTED_STARTER_APPS_JSON_FILE_NAME = 'alwaysai.tested-starter-apps.json';

export async function underscoreTestStarterAppsComponent(props: {
  yes: boolean;
  targetHostname?: string;
  reset: boolean;
}) {
  const { yes, targetHostname, reset } = props;

  const jsonFile = ConfigFile({
    path: TESTED_STARTER_APPS_JSON_FILE_NAME,
    codec: t.record(t.string, t.boolean),
    initialValue: {},
  });

  if (reset) {
    echoCommandInvocation(`rm -rf ${PRIVATE_KEY_FILE_PRETTY_PATH}`);
    rimraf.sync(PRIVATE_KEY_FILE_PATH);
    echoCommandInvocation(`rm -rf ${TESTED_STARTER_APPS_JSON_FILE_NAME}`);
    jsonFile.remove();
    echoCommandInvocation(`rm -rf ${ALWAYSAI_STARTER_APPS}`);
    rimraf.sync(ALWAYSAI_STARTER_APPS);
    echoCommandInvocation(`rm -rf ${MODEL_PACKAGE_CACHE_DIR}/${getSystemId()}`);
    await modelPackageCache.clear();
  }

  if (!existsSync(ALWAYSAI_STARTER_APPS)) {
    await aai('get-starter-apps', { yes });
  }

  jsonFile.initialize();

  cd(ALWAYSAI_STARTER_APPS);
  for (const fileName of readdirSync('.')) {
    cd(fileName);
    const tested = jsonFile.read()[fileName];
    if (!tested) {
      await testAppComponent({ yes, targetHostname, reset });
      jsonFile.update(testedJson => {
        testedJson[fileName] = true;
      });
    }
    cd('..');
  }
  cd('..');
}
