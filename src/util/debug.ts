import { ALWAYSAI_DEBUG } from '../environment';
import { echo } from './echo';

type Debug = typeof console.log;

export let debug: Debug;
if (ALWAYSAI_DEBUG) {
  debug = (...args) => echo('debug:', ...args);
} else {
  debug = () => {};
}
