import { createLeaf, TerseError } from '@alwaysai/alwayscli';
import { execSync } from 'child_process';

import { AppJsonFile } from '../../util/app-json-file';
import { VENV_BIN_ACTIVATE } from '../../constants';

export const appUnderscoreStartCliLeaf = createLeaf({
  name: '_start',
  hidden: true,
  description: 'Run this application\'s "start" script',
  action() {
    const appJsonFile = AppJsonFile(process.cwd());
    const appJson = appJsonFile.read();
    const script = appJson.scripts && appJson.scripts.start;
    if (!script) {
      throw new TerseError('This application does not define a "start" script');
    }
    execSync(`. ${VENV_BIN_ACTIVATE} && ${script}`, {
      stdio: 'inherit',
    });
  },
});
