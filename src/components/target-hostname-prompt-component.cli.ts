import { runAndExit, createCli, createLeaf } from '@alwaysai/alwayscli';
import { targetHostnamePromptComponent } from './target-hostname-prompt-component';

const leaf = createLeaf({
  name: targetHostnamePromptComponent.name,
  async action() {
    return await targetHostnamePromptComponent({
      targetHostname: 'localhost',
    });
  },
});

const cli = createCli(leaf);

if (module === require.main) {
  runAndExit(cli, ...process.argv.slice(2));
}
