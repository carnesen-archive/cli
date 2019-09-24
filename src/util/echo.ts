import { audit } from './audit';
import { NODE_ENV } from '../environment';

export const echo: (...args: any[]) => void =
  NODE_ENV === 'test'
    ? () => {}
    : (...args: Parameters<typeof console.log>) => {
        audit(`echo "${args}"`);
        console.log(...args);
      };

export function echoCommandInvocation(command: string) {
  echo(`$ ${command}`);
}
