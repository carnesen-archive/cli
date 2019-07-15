import { runAndExit, createCli, createLeaf } from '@alwaysai/alwayscli';
import { setUpPasswordlessSshComponent } from './set-up-passwordless-ssh-component';

const leaf = createLeaf({
  name: setUpPasswordlessSshComponent.name,
  async action() {
    return await setUpPasswordlessSshComponent({ targetHostname: 'localhost' });
  },
});

const cli = createCli(leaf);

if (module === require.main) {
  runAndExit(cli, ...process.argv.slice(2));
}
