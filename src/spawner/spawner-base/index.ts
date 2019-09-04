import { run } from './run';
import { runForegroundSync } from './run-foreground-sync';
import { runStreaming } from './run-streaming';
import { Cmd } from '../types';

export function SpawnerBase(translate: (cmd: Cmd) => Cmd) {
  return {
    run(cmd: Cmd) {
      return run(translate(cmd));
    },
    runForegroundSync(cmd: Cmd) {
      return runForegroundSync(translate(cmd));
    },
    runStreaming(cmd: Cmd) {
      return runStreaming(translate(cmd));
    },
  };
}

export const spawnerBase = {
  run,
  runForegroundSync,
  runStreaming,
};
