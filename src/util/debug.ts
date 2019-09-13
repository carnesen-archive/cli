import { ALWAYSAI_DEBUG } from '../environment';
import { echo } from './echo';

export const debug: (...args: any[]) => void = ALWAYSAI_DEBUG
  ? (...args) => echo('debug:', ...args)
  : () => {};
