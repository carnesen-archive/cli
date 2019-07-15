import { runAndExit, createCli, createLeaf } from '@alwaysai/alwayscli';
import { targetHostnameInputComponent } from './target-hostname-input-component';

const leaf = createLeaf({
  name: targetHostnameInputComponent.name,
  async action() {
    return await targetHostnameInputComponent({
      targetHostname: 'localhost',
      yes: false,
    });
  },
});

const cli = createCli(leaf);

if (module === require.main) {
  runAndExit(cli, ...process.argv.slice(2));
}
