import rimraf = require('rimraf');
import { readFileSync, writeFileSync } from 'fs';
import { APP_PY_FILE_NAME } from '../constants';
import { findOrWriteAppPyFileComponent } from './find-or-write-app-py-file-component';

function readAppPyFile() {
  return readFileSync(APP_PY_FILE_NAME, {
    encoding: 'utf8',
  });
}

describe(findOrWriteAppPyFileComponent.name, () => {
  const yes = true;
  it('big test of all the features', async () => {
    // Preserves the file if it exists
    writeFileSync(APP_PY_FILE_NAME, 'foo');
    await findOrWriteAppPyFileComponent({ yes });
    expect(readAppPyFile()).toBe('foo');

    // Writes the file if it does not exist
    rimraf.sync(APP_PY_FILE_NAME);
    await findOrWriteAppPyFileComponent({ yes });
    const contents0 = readAppPyFile();
    expect(contents0).toMatch('import edgeiq');
  });
});
