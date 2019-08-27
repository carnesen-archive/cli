import { prompt } from '../util/prompt';
import { TerseError } from '@alwaysai/alwayscli';

export async function confirmWriteFileComponent(props: {
  yes: boolean;
  fileName: string;
  description?: string;
}) {
  const { yes, fileName, description } = props;
  if (!yes) {
    const { confirmed } = await prompt([
      {
        type: 'confirm',
        name: 'confirmed',
        message: `${
          description ? `${description} ` : ''
        }"${fileName}" not found. Do you want to write it now?`,
        initial: true,
      },
    ]);
    if (!confirmed) {
      throw new TerseError(`Unable to proceed without "${fileName}"`);
    }
  }
}
