import * as tempy from 'tempy';
import { appInstallVirtualenv } from './app-install-virtualenv';
import { JsSpawner } from './spawner/js-spawner';
import { VENV_BIN_ACTIVATE, PYTHON_REQUIREMENTS_FILE_NAME } from '../constants';
import { appInstallPythonDependencies } from './app-install-python-dependencies';

describe(`${appInstallVirtualenv.name} and ${appInstallPythonDependencies.name}`, () => {
  it('Installs a python virtualenv and any dependencies', async () => {
    const tmpDir = tempy.directory();
    const spawner = JsSpawner({ path: tmpDir });
    await appInstallVirtualenv(spawner);
    expect(await spawner.exists(VENV_BIN_ACTIVATE)).toBe(true);
    await spawner.writeFile(PYTHON_REQUIREMENTS_FILE_NAME, 'bleach==2.0.0\n');
    await appInstallPythonDependencies(spawner);
  }, 15000);
});
