import { TargetProtocol } from '../util/target-protocol';
import { appConfigureYesComponent } from './app-configure-yes-component';
import { appConfigurePromptComponent } from './app-configure-prompt-component';

export async function appConfigureComponent(props: {
  yes: boolean;
  targetProtocol?: TargetProtocol;
  targetHostname?: string;
  targetPath?: string;
}) {
  const { yes, targetHostname, targetPath, targetProtocol } = props;

  if (yes) {
    await appConfigureYesComponent({ targetProtocol, targetHostname, targetPath });
  } else {
    await appConfigurePromptComponent({
      targetProtocol,
      targetHostname,
      targetPath,
    });
  }
}
