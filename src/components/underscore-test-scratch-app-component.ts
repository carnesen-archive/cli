import mkdirp = require('mkdirp');
import rimraf = require('rimraf');
import { existsSync, writeFileSync } from 'fs';

import {
  APP_PY_FILE_NAME,
  PYTHON_REQUIREMENTS_FILE_NAME,
  MODEL_PACKAGE_CACHE_DIR,
} from '../constants';
import { echo, echoCommandInvocation } from '../util/echo';
import { appStartComponent } from './app-start-component';
import { modelPackageCache } from '../util/model-package-cache';
import { aai } from '../util/aai';
import { TargetJsonFile } from '../util/target-json-file';
import { systemId } from '../util/cli-config';
import { appInstallComponent } from './app-install-component';
import { runWithEchoAndProceedPrompt } from '../util/run-with-echo-and-proceed-prompt';

const SCRATCH_APP = 'scratch-app';

const PYTHON_APPLICATION_CODE = `
import http.server
import socketserver

PORT = 5000

httpd = socketserver.TCPServer(("", PORT), http.server.SimpleHTTPRequestHandler)
print("Listening http://0.0.0.0:{}/".format(PORT))
httpd.serve_forever()
`;

export async function underscoreTestScratchAppComponent(props: {
  yes: boolean;
  reset: boolean;
  nodejsPlatform?: NodeJS.Platform;
}) {
  const { yes, reset, nodejsPlatform } = props;

  if (reset) {
    echoCommandInvocation(`rm -rf ${SCRATCH_APP}`);
    rimraf.sync(SCRATCH_APP);
    echoCommandInvocation(`rm -rf ${MODEL_PACKAGE_CACHE_DIR}/${systemId}`);
    await modelPackageCache.clear();
  }

  if (!existsSync(SCRATCH_APP)) {
    mkdirp.sync(SCRATCH_APP);
  }

  echoCommandInvocation(`$ cd ${SCRATCH_APP}`);
  process.chdir(SCRATCH_APP);
  await aai('app configure', { yes });
  writeFileSync(APP_PY_FILE_NAME, PYTHON_APPLICATION_CODE);
  await aai('app models add alwaysai/mobilenet_ssd', { yes });
  await aai('app models add alwaysai/yolo_v3', { yes });
  await aai('app show', { yes });
  echo(`TODO $ echo "bleach==2.0.0" > ${PYTHON_REQUIREMENTS_FILE_NAME}`);
  // writeFileSync(PYTHON_REQUIREMENTS_FILE_NAME, 'bleach==2.0.0\n');
  const targetJsonFile = TargetJsonFile();
  if (targetJsonFile.exists()) {
    await aai('app deploy', { yes });
  } else {
    if (nodejsPlatform) {
      await runWithEchoAndProceedPrompt(appInstallComponent, [{ yes, nodejsPlatform }], {
        yes,
      });
    } else {
      await aai('app install', { yes });
    }
  }
  echo('$ aai app start');
  const exitCode = await appStartComponent({ superuser: false });
  echo(`"app start" exited with code ${exitCode}`);
  process.chdir('..');
}
