import { checkForDockerComponent } from './check-for-docker-component';
import { runAndExit, createCli, createLeaf } from '@alwaysai/alwayscli';

const leaf = createLeaf({
  name: checkForDockerComponent.name,
  async action() {
    return await checkForDockerComponent({ targetHostname: 'localhost' });
  },
});

const cli = createCli(leaf);

if (module === require.main) {
  runAndExit(cli, ...process.argv.slice(2));
}
