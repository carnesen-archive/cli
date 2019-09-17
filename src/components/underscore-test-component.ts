import { cli } from '../cli';
import * as t from 'io-ts';
import {
  ALWAYSAI_STARTER_APPS,
  PRIVATE_KEY_FILE_PATH,
  PRIVATE_KEY_FILE_PRETTY_PATH,
  DOCKERFILE,
} from '../constants';
import { readdirSync, existsSync, writeFileSync } from 'fs';
import { echo } from '../util/echo';
import { appStartComponent } from './app-start-component';
import rimraf = require('rimraf');
import { ConfigFile } from '@alwaysai/config-nodejs';
import { join } from 'path';

async function aai(command: string) {
  echo(`$ aai ${command}`);
  const argv = command.split(' ');
  return await cli(...argv);
}

function StatusFile(dir = process.cwd()) {
  const statusFile = ConfigFile({
    path: join(dir, 'alwaysai.tested.json'),
    codec: t.type({
      tested: t.boolean,
    }),
    initialValue: {
      tested: false,
    },
  });
  return statusFile;
}

export async function underscoreTestComponent(props: {
  targetHostname: string;
  reset: boolean;
}) {
  const { targetHostname, reset } = props;
  if (reset) {
    echo(`$ rm -f ${PRIVATE_KEY_FILE_PRETTY_PATH}`);
    rimraf.sync(PRIVATE_KEY_FILE_PATH);
    echo(`rm -rf ${ALWAYSAI_STARTER_APPS}`);
    rimraf.sync(ALWAYSAI_STARTER_APPS);
  }
  if (!existsSync(ALWAYSAI_STARTER_APPS)) {
    await aai('get-starter-apps');
  }
  process.chdir(ALWAYSAI_STARTER_APPS);
  let index = 0;
  for (const fileName of readdirSync('.')) {
    echo(`$ cd ${fileName}`);
    process.chdir(fileName);
    const statusFile = StatusFile();
    statusFile.initialize();
    const status = statusFile.read();
    if (!status.tested) {
      if (index > 0) {
        await aai(
          `app configure --yes --protocol ssh+docker: --hostname ${targetHostname}`,
        );
      }
      await aai('app deploy');
      echo('$ aai app start');
      const exitCode = await appStartComponent({ superuser: true });
      echo(`"app start" exited with code ${exitCode}`);
    }
    statusFile.write({ tested: true });
    index = index + 1;
    process.chdir('..');
  }
}
