import { createLeaf } from '@alwaysai/alwayscli';
import { AppJsonFile } from '../../util/app-json-file';
import { echo } from '../../util/echo';
import { TargetJsonFile } from '../../util/target-json-file';

export const appShowCliLeaf = createLeaf({
  name: 'show',
  description: 'Show the application configuration of your current directory',
  action() {
    const appJsonFile = AppJsonFile();
    echo(appJsonFile.describeModels());
    echo();
    echo(appJsonFile.describeScripts());
    echo();
    echo(TargetJsonFile().describe());
  },
});
