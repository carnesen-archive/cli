import { createLeaf, createStringArrayInput } from '@alwaysai/alwayscli';
import { targetConfigFile } from '../../util/target-config-file';

export const appExecCliLeaf = createLeaf({
  name: 'exec',
  description: 'Run a command in the target directory',
  args: createStringArrayInput({
    placeholder: '<command> [<args>]',
    required: true,
  }),
  async action([exe, ...args]) {
    const spawner = targetConfigFile.readContainerSpawner();
    spawner.runForegroundSync({ exe, args, cwd: '.' });
  },
});
