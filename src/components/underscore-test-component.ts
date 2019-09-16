import tempy = require('tempy');
import { aai } from '../aai';
import { ALWAYSAI_STARTER_APPS } from '../constants';
import { readdirSync } from 'fs';
import { echo } from '../util/echo';

export async function underscoreTestComponent(props: { targetHostname: string }) {
  const { targetHostname } = props;
  const tmpDir = tempy.directory();
  echo(`Running tests in ${tmpDir}`);
  process.chdir(tmpDir);
  await aai('get-starter-apps');
  process.chdir(ALWAYSAI_STARTER_APPS);
  for (const fileName of readdirSync('.')) {
    echo(fileName);
    process.chdir(fileName);
    await aai(
      'app',
      'configure',
      '--yes',
      '--protocol',
      'ssh+docker:',
      '--hostname',
      targetHostname,
    );
    await aai('app', 'deploy');
    try {
      await aai();
    } catch (exception) {}
    process.chdir('..');
  }
}
