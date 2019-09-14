import { writeFileSync, existsSync } from 'fs';
import { APP_PY_FILE_NAME } from '../constants';
import { confirmWriteFilePromptComponent } from './confirm-write-file-prompt-component';
import { Spinner } from '../util/spinner';

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

export async function findOrWriteAppPyFileComponent(props: { yes: boolean }) {
  const { yes } = props;
  if (existsSync(APP_PY_FILE_NAME)) {
    Spinner(FOUND_MESSAGE).succeed();
  } else {
    // !exists
    const confirmed =
      yes ||
      (await confirmWriteFilePromptComponent({
        fileName: APP_PY_FILE_NAME,
        description: 'Application file',
      }));
    if (confirmed) {
      try {
        writeFileSync(APP_PY_FILE_NAME, APPLICATION_SOURCE_CODE, { flag: 'wx' });
        Spinner(WRITE_MESSAGE).succeed();
      } catch (exception) {
        if (exception.code === 'EEXIST') {
          // Unlikely scenario that the file did not exist but now does
          Spinner(FOUND_MESSAGE).succeed();
        } else {
          Spinner(WRITE_MESSAGE).fail();
          throw exception;
        }
      }
    }
  }
}
