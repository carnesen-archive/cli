import { appShowCliLeaf as appShow } from '../show';
import { appConfigFile } from '../../../util/app-config-file';

export const showModels: typeof appShow = {
  ...appShow,
  description: 'Show this application\'s "models" configuration',
  async action() {
    return appConfigFile.describeModels();
  },
};
