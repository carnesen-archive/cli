import { TargetJsonFile } from '../util/target-json-file';
import { runWithSpinner } from '../util/run-with-spinner';

export async function removeTargetJsonFileComponent() {
  const targetJsonFile = TargetJsonFile();
  if (targetJsonFile.exists()) {
    runWithSpinner(targetJsonFile.remove, [], 'Remove target configuration file');
  }
}
