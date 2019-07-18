import { runAndExit, createCli, createLeaf } from '@alwaysai/alwayscli';
import { targetProtocolPromptedInputComponent } from './target-protocol-input-component';

const leaf = createLeaf({
  name: targetProtocolPromptedInputComponent.name,
  async action() {
    return await targetProtocolPromptedInputComponent({
      developerHostPlatform: 'linux',
    });
  },
});

const cli = createCli(leaf);

if (module === require.main) {
  runAndExit(cli, ...process.argv.slice(2));
}
