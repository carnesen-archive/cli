import mkdirp = require('mkdirp');
import rimraf = require('rimraf');
import { existsSync, writeFileSync } from 'fs';

import { APP_PY_FILE_NAME, MODEL_PACKAGE_CACHE_DIR } from '../constants';
import { echoCommandInvocation } from '../util/echo';
import { modelPackageCache } from '../util/model-package-cache';
import { aai } from '../util/aai';
import { testAppComponent } from './test-app-component';
import { cd } from '../util/cd';
import { getSystemId } from '../util/system-id';

const SCRATCH_APP = 'scratch-app';

const PYTHON_APPLICATION_CODE = `
import http.server
import socketserver

PORT = 5000

httpd = socketserver.TCPServer(("", PORT), http.server.SimpleHTTPRequestHandler)
print("Listening http://0.0.0.0:{}/".format(PORT))
httpd.serve_forever()
`;

export async function testScratchAppComponent(props: {
  yes: boolean;
  reset: boolean;
  targetHostname?: string;
}) {
  const { yes, reset, targetHostname } = props;

  if (reset) {
    echoCommandInvocation(`rm -rf ${SCRATCH_APP}`);
    rimraf.sync(SCRATCH_APP);
    echoCommandInvocation(`rm -rf ${MODEL_PACKAGE_CACHE_DIR}/${getSystemId()}`);
    await modelPackageCache.clear();
  }

  if (!existsSync(SCRATCH_APP)) {
    mkdirp.sync(SCRATCH_APP);
  }

  cd(SCRATCH_APP);
  await testAppComponent({ targetHostname, reset, yes });
  writeFileSync(APP_PY_FILE_NAME, PYTHON_APPLICATION_CODE);
  await aai('app models add alwaysai/squeezenet_v1.1 alwaysai/mobilenet_v1_1.0_224', {
    yes,
  });
  await aai('app show', { yes });
  // TODO: Uncomment this once the requirements.txt feature works
  // echoCommandInvocation(`echo "bleach==2.0.0" > ${PYTHON_REQUIREMENTS_FILE_NAME}`);
  // writeFileSync(PYTHON_REQUIREMENTS_FILE_NAME, 'bleach==2.0.0\n');
  await testAppComponent({ targetHostname, reset: false, yes: true });
  cd('..');
}
