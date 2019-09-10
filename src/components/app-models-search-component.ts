import { echo } from '../util/echo';
import { rpcClient } from '../util/rpc-client';
import { authenticationClient } from '../util/authentication-client';
import { checkUserIsLoggedInComponent } from './check-user-is-logged-in-component';

export async function appModelsSearchComponent(props: { yes: boolean }) {
  const { yes } = props;
  await checkUserIsLoggedInComponent({ yes });
  const { username } = await authenticationClient.getInfo();

  const publicModelVersions = await rpcClient.listPublicModelVersions();
  const privateModelVersions = await rpcClient.listPrivateModelVersions({
    publisher: username,
  });

  const allModelVersions = [...publicModelVersions, ...privateModelVersions];
  const uniqueIds = [...new Set(allModelVersions.map(({ id }) => id))];
  echo(uniqueIds.join('\n'));
}
