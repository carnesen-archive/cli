import { writeFileSync } from 'fs';
import ora = require('ora');
import { APP_DOT_PY } from '../constants';

const APPLICATION_SOURCE_CODE = `import cv2
import edgeiq

def main():
    # Your alwaysAI app goes here!
    pass

if __name__ == "__main__":
    main()`;

export async function writeAppPyFileComponent() {
  try {
    writeFileSync(APP_DOT_PY, APPLICATION_SOURCE_CODE, { flag: 'wx' });
    ora(`Write ${APP_DOT_PY}`).succeed();
  } catch (ex) {
    if (ex.code !== 'EEXIST') {
      throw ex;
    }
    ora(`Found ${APP_DOT_PY}`).succeed();
  }
}
