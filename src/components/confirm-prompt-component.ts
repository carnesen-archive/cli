import { promptForInput } from '../util/prompt-for-input';

export async function confirmPromptComponent(props: { message: string }) {
  const { message } = props;
  const { confirmed }: { confirmed: boolean } = await promptForInput({
    purpose: `to confirm "${message}"`,
    questions: [
      {
        type: 'confirm',
        name: 'confirmed',
        message,
        initial: true,
      },
    ],
  });
  return confirmed;
}
