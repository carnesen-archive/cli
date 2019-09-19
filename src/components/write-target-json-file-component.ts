import ora = require('ora');
import { TargetJsonFile, TargetJson } from '../util/target-json-file';
import { TARGET_JSON_FILE_NAME } from '../constants';

export async function writeTargetJsonFileComponent(targetJson: TargetJson) {
  const message = `Write ${TARGET_JSON_FILE_NAME}`;
  try {
    TargetJsonFile().write(targetJson);
    ora(message).succeed();
  } catch (exception) {
    ora(message).fail();
    throw exception;
  }
}
