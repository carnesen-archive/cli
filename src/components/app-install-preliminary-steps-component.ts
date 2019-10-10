import { CliTerseError } from '@alwaysai/alwayscli';

import { AppJsonFile } from '../util/app-json-file';
import { checkUserIsLoggedInComponent } from './check-user-is-logged-in-component';

export async function appInstallPreliminaryStepsComponent(props: { yes: boolean }) {
  const { yes } = props;

  await checkUserIsLoggedInComponent({ yes });

  const appJsonFile = AppJsonFile();
  if (!appJsonFile.exists()) {
    throw new CliTerseError(MissingFilePleaseRunAppConfigureMessage(appJsonFile.name));
  }
}

function MissingFilePleaseRunAppConfigureMessage(fileName: string) {
  return `Missing file "${fileName}". Please run \`alwaysai app configure\` to set up this directory as an alwaysAI application.`;
}
