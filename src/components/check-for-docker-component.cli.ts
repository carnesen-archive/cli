import { checkForDockerComponent } from './check-for-docker-component';
import { CliLeaf, runCliAndExit } from '@alwaysai/alwayscli';

const leaf = CliLeaf({
  name: checkForDockerComponent.name,
  async action() {
    return await checkForDockerComponent({ targetHostname: 'localhost' });
  },
});

if (module === require.main) {
  runCliAndExit(leaf);
}
