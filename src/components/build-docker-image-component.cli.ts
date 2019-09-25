import { runAndExit, createCli, createLeaf, createFlagInput } from '@alwaysai/alwayscli';
import { basename } from 'path';
import { buildDockerImageComponent } from './build-docker-image-component';
import { JsSpawner } from '../util/spawner/js-spawner';

const leaf = createLeaf({
  name: basename(__filename),
  options: {
    rm: createFlagInput({ description: 'Run "docker system prune --all --force"' }),
  },
  async action(_, { rm }) {
    const targetHostSpawner = JsSpawner();
    if (rm) {
      await targetHostSpawner.run({
        exe: 'docker',
        args: ['system', 'prune', '--all', '--force'],
      });
    }
    await buildDockerImageComponent({ targetHostSpawner });
  },
});

const cli = createCli(leaf);

if (module === require.main) {
  runAndExit(cli, ...process.argv.slice(2));
}
