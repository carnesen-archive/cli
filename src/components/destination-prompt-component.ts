import { Choice } from 'prompts';
import KeyMirror = require('keymirror');

import { promptForInput } from '../util/prompt-for-input';

export const Destination = KeyMirror({
  YOUR_LOCAL_COMPUTER: null,
  REMOTE_DEVICE: null,
});

type Destination = keyof typeof Destination;

export async function destinationPromptComponent(props: { destination?: Destination }) {
  const choices: Choice[] = [
    { title: 'Your local computer', value: Destination.YOUR_LOCAL_COMPUTER },
    {
      title: 'Remote device',
      value: Destination.REMOTE_DEVICE,
    },
  ];

  const foundChoiceIndex = choices.findIndex(
    choice => choice.value === props.destination,
  );
  const initial = foundChoiceIndex > -1 ? foundChoiceIndex : 0;

  const answer = await promptForInput({
    purpose:
      'to choose whether you want to run your application here on this computer or on a remote device',
    questions: [
      {
        type: 'select',
        name: 'destination',
        message: 'What is the destination?',
        initial,
        choices,
      },
    ],
  });

  const destination: Destination = answer.destination;
  return destination;
}
