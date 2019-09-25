import { platform } from 'os';
import { TargetProtocol } from '../util/target-protocol';
import { targetJsonPromptComponent } from './target-json-prompt-component';
import { appConfigurePreliminaryStepsComponent } from './app-configure-preliminary-steps-component';
import { appConfigureYesComponent } from './app-configure-yes-component';

export async function appConfigureComponent(props: {
  yes: boolean;
  osPlatform?: NodeJS.Platform;
  targetProtocol?: TargetProtocol;
  targetHostname?: string;
  targetPath?: string;
}) {
  const {
    yes,
    targetHostname,
    targetPath,
    targetProtocol,
    osPlatform = platform(),
  } = props;

  if (yes) {
    await appConfigureYesComponent({ targetProtocol, targetHostname, targetPath });
  } else {
    await appConfigurePreliminaryStepsComponent({ yes });

    await targetJsonPromptComponent({
      osPlatform,
      targetProtocol,
      targetHostname,
      targetPath,
    });
  }
}
