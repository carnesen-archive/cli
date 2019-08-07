import { runAndExit, createCli, createLeaf } from '@alwaysai/alwayscli';
import { writeDockerfileComponent } from './write-dockerfile-component';

const leaf = createLeaf({
  name: writeDockerfileComponent.name,
  async action() {
    return await writeDockerfileComponent();
  },
});

const cli = createCli(leaf);

if (module === require.main) {
  runAndExit(cli, ...process.argv.slice(2));
}
