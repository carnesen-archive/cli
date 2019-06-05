import { createLeaf, TerseError } from '@alwaysai/alwayscli';

import { appConfigFile } from '../../config/app-config-file';
import { VENV } from '../../app-installer';
import { execSync } from 'child_process';
import { join } from 'path';

export const appStart = createLeaf({
  name: '_start',
  hidden: true,
  description: 'Run this application\'s "start" script',
  options: {},
  action() {
    const appConfig = appConfigFile.read();
    const script = appConfig.scripts && appConfig.scripts.start;
    if (!script) {
      throw new TerseError('This application does not define a "start" script');
    }
    execSync(`. ${join(VENV, 'bin', 'activate')} && ${script}`, {
      stdio: 'inherit',
    });
  },
});
