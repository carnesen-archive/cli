import { prompt } from '../util/prompt';

export async function confirmPromptComponent(props: { message: string }) {
  const { message } = props;
  const { confirmed }: { confirmed: boolean } = await prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message,
      initial: true,
    },
  ]);
  return confirmed;
}
