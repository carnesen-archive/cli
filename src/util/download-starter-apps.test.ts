import { downloadStarterApps, ALWAYSAI_STARTER_APPS } from './download-starter-apps';
import tempy = require('tempy');
import { AppJsonFile } from './app-json-file';
import { join } from 'path';

describe(downloadStarterApps.name, () => {
  it('downloads the starter apps from the cloud to the specified directory', async () => {
    const tmpDir = tempy.directory();
    await downloadStarterApps(tmpDir);
    const appJsonFile = AppJsonFile(
      join(tmpDir, ALWAYSAI_STARTER_APPS, 'object_detector'),
    );
    const appJson = appJsonFile.read();
    expect(appJson.models).toBeTruthy();
  });
});
