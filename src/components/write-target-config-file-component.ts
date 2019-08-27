import ora = require('ora');
import { targetConfigFile } from '../util/target-config-file';
import { TARGET_JSON_FILE_NAME } from '../constants';

export async function writeTargetConfigFileComponent(
  ...args: Parameters<typeof targetConfigFile.write>
) {
  const message = `Write ${TARGET_JSON_FILE_NAME}`;
  try {
    targetConfigFile.write(...args);
    ora(message).succeed();
  } catch (exception) {
    ora(message).fail();
    throw exception;
  }
}
