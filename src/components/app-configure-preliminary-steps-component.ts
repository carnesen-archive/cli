import { findOrWriteAppJsonFileComponent } from './find-or-write-app-json-file-component';
import { findOrWriteAppPyFileComponent } from './find-or-write-app-py-file-component';
import { checkUserIsLoggedInComponent } from './check-user-is-logged-in-component';
import { findOrWriteDockerfileComponent } from './find-or-write-dockerfile-component';

export async function appConfigurePreliminaryStepsComponent(props: {
  yes: boolean;
  weAreInAppConfigure: boolean;
}) {
  const { yes, weAreInAppConfigure } = props;
  await checkUserIsLoggedInComponent({ yes });
  await findOrWriteAppJsonFileComponent({ yes, weAreInAppConfigure });
  await findOrWriteAppPyFileComponent({ yes, weAreInAppConfigure });
  await findOrWriteDockerfileComponent({ yes, weAreInAppConfigure });
}
