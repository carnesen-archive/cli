import { CliLeaf, CliFlagInput, runCliAndExit } from '@alwaysai/alwayscli';
import { basename } from 'path';
import { buildDockerImageComponent } from './build-docker-image-component';
import { JsSpawner } from '../util/spawner/js-spawner';

const leaf = CliLeaf({
  name: basename(__filename),
  namedInputs: {
    rm: CliFlagInput({ description: 'Run "docker system prune --all --force"' }),
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

if (module === require.main) {
  runCliAndExit(leaf);
}
