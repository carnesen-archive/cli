import { audit } from './audit';

export function echo(...args: Parameters<typeof console.log>) {
  audit(`echo "${args}"`);
  console.log(...args);
}
