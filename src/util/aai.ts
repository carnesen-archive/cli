import { echo } from './echo';
import { cli } from '../cli';

export async function aai(command: string) {
  echo(`$ aai ${command}`);
  const argv = command.split(' ');
  return await cli(...argv);
}
