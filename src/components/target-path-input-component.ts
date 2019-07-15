import { prompt } from '../util/prompt';
import { RequiredWithYesMessage } from '../util/required-with-yes-message';
import { UsageError, TerseError } from '@alwaysai/alwayscli';
import { posix, basename } from 'path';
import { createTargetDirectoryComponent } from './create-target-directory-component';

export async function targetPathInputComponent(props: {
  yes: boolean;
  targetHostname: string;
  targetPath?: string;
}) {
  if (props.yes) {
    if (!props.targetPath) {
      throw new UsageError(RequiredWithYesMessage('path'));
    }
    const writable = await createTargetDirectoryComponent({
      targetHostname: props.targetHostname,
      targetPath: props.targetPath,
    });
    if (!writable) {
      throw new TerseError(`Target path "${props.targetPath}" is not writable`);
    }
    return props.targetPath;
  }
  let writable = false;
  let targetPath = props.targetPath || '';
  while (!writable) {
    const answer = await prompt([
      {
        type: 'text',
        name: 'targetPath',
        message: 'Where do you want to run the app? Enter a filesystem path:',
        initial: targetPath || posix.join('alwaysai', basename(process.cwd())),
        validate: value => (!value ? 'Value is required' : true),
      },
    ]);

    targetPath = answer.targetPath;
    writable = await createTargetDirectoryComponent({
      targetHostname: props.targetHostname,
      targetPath,
    });
  }
  return targetPath;
}
