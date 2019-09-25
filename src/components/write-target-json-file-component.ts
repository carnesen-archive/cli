import { TargetJsonFile, TargetJson } from '../util/target-json-file';
import { TARGET_JSON_FILE_NAME } from '../constants';
import { Spinner } from '../util/spinner';

export async function writeTargetJsonFileComponent(targetJson: TargetJson) {
  const message = `Write ${TARGET_JSON_FILE_NAME}`;
  try {
    TargetJsonFile().write(targetJson);
    Spinner(message).succeed();
  } catch (exception) {
    Spinner(message).fail();
    throw exception;
  }
}
