import ora = require('ora');

import { targetProtocolPromptedInputComponent } from './target-protocol-input-component';
import { TargetProtocol } from '../util/target-protocol';
import { checkForDockerComponent } from './check-for-docker-component';
import { targetConfigFile, TARGET_CONFIG_FILE_NAME } from '../util/target-config-file';
import { targetHostnameInputComponent } from './target-hostname-input-component';
import { targetPathInputComponent } from './target-path-input-component';
import { writeAppConfigFileComponent } from './write-app-config-file-component';
import { writeAppPyFileComponent } from './write-app-py-file-component';
import { checkUserIsLoggedInComponent } from './check-user-is-logged-in-component';

export async function appConfigureComponent(props: {
  yes: boolean;
  targetProtocol: TargetProtocol;
  targetHostname: string;
  targetPath: string;
}) {
  const { yes } = props;
  await checkUserIsLoggedInComponent({ yes });
  await writeAppConfigFileComponent();
  await writeAppPyFileComponent();

  const targetProtocol = yes
    ? props.targetProtocol
    : await targetProtocolPromptedInputComponent({
        targetProtocol: props.targetProtocol,
      });

  switch (targetProtocol) {
    case 'docker:':
      await checkForDockerComponent();
      targetConfigFile.write({ protocol: targetProtocol });
      ora(`Write ${TARGET_CONFIG_FILE_NAME}`).succeed();
      break;

    case 'ssh+docker:':
      const targetHostname = yes
        ? props.targetHostname
        : await targetHostnameInputComponent({
            yes,
            targetHostname: props.targetHostname,
          });

      await checkForDockerComponent({ targetHostname });

      const targetPath = await targetPathInputComponent({
        yes,
        targetHostname,
        targetPath: props.targetPath,
      });

      targetConfigFile.write({
        protocol: targetProtocol,
        hostname: targetHostname,
        path: targetPath,
      });

      ora(`Write ${TARGET_CONFIG_FILE_NAME}`).succeed();
      break;

    default:
      throw new Error(`Unexpected target protocol ${targetProtocol}`);
  }
}
