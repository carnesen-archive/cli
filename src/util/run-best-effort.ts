import { debug } from './debug';

export function runBestEffort<T extends any[]>(fn: (...args: T) => any, ...args: T) {
  (async () => {
    try {
      await fn(...args);
    } catch (exception) {
      debug(exception);
    }
  })();
}
