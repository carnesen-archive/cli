import { runAndCatch, TERSE } from '@alwaysai/alwayscli';
import tempy = require('tempy');
import { join } from 'path';

import { getStarterApps } from './get-starter-apps';
import { AppJsonFile } from './app-json-file';
import { ALWAYSAI_STARTER_APPS } from '../constants';

describe(getStarterApps.name, () => {
  it('downloads the starter apps from the cloud to the specified directory', async () => {
    const tmpDir = tempy.directory();
    await getStarterApps(tmpDir);
    const appJsonFile = AppJsonFile(
      join(tmpDir, ALWAYSAI_STARTER_APPS, 'object_detector'),
    );
    const appJson = appJsonFile.read();
    expect(appJson.models).toBeTruthy();
    // Throws a TERSE error if the directory already exists
    expect((await runAndCatch(getStarterApps, tmpDir)).code).toBe(TERSE);
  });
});
