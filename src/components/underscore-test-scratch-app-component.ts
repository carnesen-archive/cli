import { APP_PY_FILE_NAME } from '../constants';
import { existsSync, writeFileSync } from 'fs';
import { echo } from '../util/echo';
import { appStartComponent } from './app-start-component';
import rimraf = require('rimraf');
import { modelPackageCache } from '../util/model-package-cache';
import { aai } from '../util/aai';
import mkdirp = require('mkdirp');
import { confirmPromptComponent } from './confirm-prompt-component';
import { TerseError } from '@alwaysai/alwayscli';

const SCRATCH_APP = 'scratch-app';

const PYTHON_APPLICATION_CODE = `
import http.server
import socketserver

PORT = 5000

httpd = socketserver.TCPServer(("", PORT), http.server.SimpleHTTPRequestHandler)
print("Listening http://0.0.0.0:{}/".format(PORT))
httpd.serve_forever()
`;

export async function underscoreTestScratchAppComponent(props: { reset: boolean }) {
  const { reset } = props;

  if (reset) {
    echo(`rm -rf ${SCRATCH_APP}`);
    rimraf.sync(SCRATCH_APP);
    echo('clear model package cache');
    await modelPackageCache.clear();
  }

  if (!existsSync(SCRATCH_APP)) {
    mkdirp.sync(SCRATCH_APP);
  }

  echo(`$ cd ${SCRATCH_APP}`);
  process.chdir(SCRATCH_APP);
  await aai('app configure');
  writeFileSync(APP_PY_FILE_NAME, PYTHON_APPLICATION_CODE);
  await aai('app models add alwaysai/mobilenet_ssd');
  await proceedPromptComponent();
  await aai('app models show');
  await proceedPromptComponent();
  await aai('app show');
  await proceedPromptComponent();
  await aai('app models add alwaysai/alexnet');
  await proceedPromptComponent();
  await aai('app show');
  await proceedPromptComponent();
  await aai('app deploy');
  echo('$ aai app start');
  const exitCode = await appStartComponent({ superuser: false });
  echo(`"app start" exited with code ${exitCode}`);
  process.chdir('..');
}

async function proceedPromptComponent() {
  const confirmed = await confirmPromptComponent({ message: 'Proceed?' });
  if (!confirmed) {
    throw new TerseError('User elected not to proceed');
  }
}
