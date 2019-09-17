import { posix, basename } from 'path';

import { TERSE } from '@alwaysai/alwayscli';

import { prompt } from '../util/prompt';
import { createTargetDirectoryComponent } from './create-target-directory-component';
import { echo } from '../util/echo';
import { TargetPathDefaultValue } from '../util/target-path-default-value';

export async function targetPathPromptComponent(props: {
  targetHostname: string;
  targetPath?: string;
}) {
  let writable = false;
  let targetPath: string;
  let skipPromptForTargetPath: boolean;
  const targetPathDefaultValue = TargetPathDefaultValue();
  if (props.targetPath) {
    // Existing value or command-line input
    targetPath = props.targetPath;
    skipPromptForTargetPath = false;
  } else {
    targetPath = targetPathDefaultValue;
    ({ skipPromptForTargetPath } = await prompt([
      {
        type: 'confirm',
        name: 'skipPromptForTargetPath',
        message: `Would you like to use the default installation directory "${targetPathDefaultValue}"?`,
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
          initial: targetPath || targetPathDefaultValue,
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
