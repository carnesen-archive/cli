import { runAndExit, createCli, createLeaf } from '@alwaysai/alwayscli';
import { targetProtocolInputComponent } from './target-protocol-input-component';

const leaf = createLeaf({
  name: targetProtocolInputComponent.name,
  async action() {
    return await targetProtocolInputComponent({
      yes: false,
      developerHostPlatform: 'linux',
    });
  },
});

const cli = createCli(leaf);

if (module === require.main) {
  runAndExit(cli, ...process.argv.slice(2));
}
