import { findOrWriteAppJsonFileComponent } from './find-or-write-app-json-file-component';
import { checkUserIsLoggedInComponent } from './check-user-is-logged-in-component';

export async function appConfigurePreliminaryStepsComponent(props: { yes: boolean }) {
  const { yes } = props;
  await checkUserIsLoggedInComponent({ yes });
  await findOrWriteAppJsonFileComponent({ yes });
}
