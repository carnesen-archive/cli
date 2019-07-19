import { createLeaf } from '@alwaysai/alwayscli';
import { appConfigFile } from '../../util/app-config-file';
import { echo } from '../../util/echo';
import { targetConfigFile } from '../../util/target-config-file';

export const appShowCliLeaf = createLeaf({
  name: 'show',
  description: "Show this application's configuration",
  options: {},
  action() {
    echo(appConfigFile.describeModels());
    echo();
    echo(appConfigFile.describeScripts());
    echo();
    echo(targetConfigFile.describe());
  },
});
