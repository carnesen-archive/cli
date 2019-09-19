import { TERSE } from '@alwaysai/alwayscli';

import { promptForInput } from '../util/prompt-for-input';
import { createTargetDirectoryComponent } from './create-target-directory-component';
import { echo } from '../util/echo';
import { TargetPathDefaultValue } from '../util/target-path-default-value';
import { confirmPromptComponent } from './confirm-prompt-component';

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
    skipPromptForTargetPath = await confirmPromptComponent({
      message: `Would you like to use the default installation directory "${targetPathDefaultValue}"?`,
    });
  }

  while (!writable) {
    if (!skipPromptForTargetPath) {
      ({ targetPath } = await promptForInput({
        purpose: 'for a target path',
        questions: [
          {
            type: 'text',
            name: 'targetPath',
            message: 'Where do you want to run the app? Enter a filesystem path:',
            initial: targetPath || targetPathDefaultValue,
            validate: value => (!value ? 'Value is required' : true),
          },
        ],
      }));
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
