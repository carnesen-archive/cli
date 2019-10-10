import { CliLeaf, runCliAndExit } from '@alwaysai/alwayscli';
import { setUpPasswordlessSshComponent } from './set-up-passwordless-ssh-component';

const leaf = CliLeaf({
  name: setUpPasswordlessSshComponent.name,
  async action() {
    return await setUpPasswordlessSshComponent({ targetHostname: 'localhost' });
  },
});

if (module === require.main) {
  runCliAndExit(leaf);
}
