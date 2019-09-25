import { appShowCliLeaf as appShow } from '../show';
import { AppJsonFile } from '../../../util/app-json-file';

export const showModels: typeof appShow = {
  ...appShow,
  description: 'Show this application\'s "models" configuration',
  async action() {
    const appJsonFile = AppJsonFile();
    return appJsonFile.describeModels();
  },
};
