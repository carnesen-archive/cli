import { writeFileSync, existsSync } from 'fs';
import ora = require('ora');
import { APP_PY_FILE_NAME } from '../constants';
import { confirmWriteFileComponent } from './confirm-write-file-component';
import { TerseError } from '@alwaysai/alwayscli';
import { MissingFilePleaseRunAppConfigureMessage } from '../util/missing-file-please-run-app-configure-message';

const APPLICATION_SOURCE_CODE = `import cv2
import edgeiq

def main():
    # Your alwaysAI app goes here!
    print("This is a stub of an alwaysAI application")

if __name__ == "__main__":
    main()
`;

const WRITE_MESSAGE = `Write ${APP_PY_FILE_NAME}`;
const FOUND_MESSAGE = `Found ${APP_PY_FILE_NAME}`;

export async function findOrWriteAppPyFileComponent(props: {
  yes: boolean;
  weAreInAppConfigure: boolean;
}) {
  const { yes, weAreInAppConfigure } = props;
  if (existsSync(APP_PY_FILE_NAME)) {
    ora(FOUND_MESSAGE).succeed();
  } else {
    // !exists
    if (yes && !weAreInAppConfigure) {
      throw new TerseError(MissingFilePleaseRunAppConfigureMessage(APP_PY_FILE_NAME));
    }
    await confirmWriteFileComponent({
      yes,
      fileName: APP_PY_FILE_NAME,
      description: 'Application file',
    });
    // At this point we are either yes or confirmed
    try {
      writeFileSync(APP_PY_FILE_NAME, APPLICATION_SOURCE_CODE, { flag: 'wx' });
      ora(WRITE_MESSAGE).succeed();
    } catch (exception) {
      if (exception.code === 'EEXIST') {
        // Unlikely scenario that the file did not exist but now does
        ora(FOUND_MESSAGE).succeed();
      } else {
        ora(WRITE_MESSAGE).fail();
        throw exception;
      }
    }
  }
}
