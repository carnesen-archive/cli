import { posix, basename } from 'path';

import { TERSE } from '@alwaysai/alwayscli';

import { prompt } from '../util/prompt';
import { createTargetDirectoryComponent } from './create-target-directory-component';
import { echo } from '../util/echo';

export async function targetPathPromptComponent(props: {
  targetHostname: string;
  targetPath?: string;
}) {
  const DEFAULT_TARGET_PATH = posix.join('alwaysai', basename(process.cwd()));
  let writable = false;
  let targetPath: string;
  let skipPromptForTargetPath: boolean;
  if (props.targetPath) {
    // Existing value or command-line input
    targetPath = props.targetPath;
    skipPromptForTargetPath = false;
  } else {
    targetPath = DEFAULT_TARGET_PATH;
    ({ skipPromptForTargetPath } = await prompt([
      {
        type: 'confirm',
        name: 'skipPromptForTargetPath',
        message: `Would you like to use the default installation directory "${DEFAULT_TARGET_PATH}"?`,
        initial: true,
      },
    ]));
  }

  while (!writable) {
    if (!skipPromptForTargetPath) {
      ({ targetPath } = await prompt([
        {
          type: 'text',
          name: 'targetPath',
          message: 'Where do you want to run the app? Enter a filesystem path:',
          initial: targetPath || DEFAULT_TARGET_PATH,
          validate: value => (!value ? 'Value is required' : true),
        },
      ]));
    }
    try {
      await createTargetDirectoryComponent({
        targetHostname: props.targetHostname,
        targetPath,
      });
      writable = true;
    } catch (exception) {
      if (exception.code === TERSE) {
        skipPromptForTargetPath = false;
        echo(exception.message);
      } else {
        throw exception;
      }
    }
  }
  return targetPath;
}
