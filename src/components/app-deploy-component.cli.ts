import { runAndExit, createCli, createLeaf, createFlagInput } from '@alwaysai/alwayscli';
import { yesCliInput } from '../cli-inputs/yes-cli-input';
import { targetHostnameCliInput } from '../cli-inputs/target-hostname-cli-input';
import { targetPathCliInput } from '../cli-inputs/target-path-cli-input';
import { TargetJsonFile } from '../util/target-json-file';
import { appDeployComponent } from './app-deploy-component';
import { DOCKER_IMAGE_ID_INITIAL_VALUE } from '../constants';

const leaf = createLeaf({
  name: appDeployComponent.name,
  options: {
    yes: yesCliInput,
    rm: createFlagInput({ description: 'Remove the target config file first' }),
    hostname: targetHostnameCliInput,
    path: targetPathCliInput,
  },
  async action(_, { yes, rm, hostname: targetHostname, path: targetPath }) {
    const targetJsonFile = TargetJsonFile();
    if (rm) {
      targetJsonFile.remove();
    }
    if (targetHostname && targetPath) {
      targetJsonFile.write({
        targetProtocol: 'ssh+docker:',
        targetHostname,
        targetPath,
        dockerImageId: DOCKER_IMAGE_ID_INITIAL_VALUE,
      });
    }
    await appDeployComponent({
      yes,
    });
  },
});

const cli = createCli(leaf);

if (module === require.main) {
  runAndExit(cli, ...process.argv.slice(2));
}
