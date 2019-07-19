import { createLeaf, createStringArrayInput } from '@alwaysai/alwayscli';
import { targetConfigFile } from '../../util/target-config-file';

export const appExecCliLeaf = createLeaf({
  name: 'exec',
  description: 'Run a command in the target directory',
  args: createStringArrayInput({
    placeholder: '<command> [<args>]',
    required: true,
  }),
  action([exe, ...args]) {
    const spawner = targetConfigFile.readSpawner();
    spawner.runForegroundSync({ exe, args, cwd: '.' });
  },
});
