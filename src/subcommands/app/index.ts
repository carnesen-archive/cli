import { createBranch } from '@alwaysai/alwayscli';
import { appShowCliLeaf } from './show';
import { appModelsCliBranch } from './models';
import { appInstallCliLeaf } from './install';
import { appConfigureCliLeaf } from './configure';
import { appDeployCliLeaf } from './deploy';
import { appStartCliLeaf } from './start';
import { appExecCliLeaf } from './exec';
import { appShellCliLeaf } from './shell';

export const appCliBranch = createBranch({
  name: 'app',
  description: 'Develop an alwaysAI application',
  subcommands: [
    appConfigureCliLeaf,
    appDeployCliLeaf,
    appExecCliLeaf,
    appModelsCliBranch,
    appShellCliLeaf,
    appShowCliLeaf,
    appStartCliLeaf,
    appInstallCliLeaf,
  ],
});
