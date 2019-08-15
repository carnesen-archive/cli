import { UserData } from 'amazon-cognito-identity-js';

import { getMaybeCurrentUser, getCurrentUser } from '../util/cognito-auth';
import { RpcClient } from '../rpc-client';
import { alwaysaiUserPromptedLoginComponent } from './alwaysai-user-prompted-login-component';
import { echo } from '../util/echo';

export async function searchModelsComponent() {
  const maybeUser = getMaybeCurrentUser();
  if (!maybeUser) {
    await alwaysaiUserPromptedLoginComponent();
  }
  const user = getCurrentUser();
  const rpcClient = await RpcClient();
  const userData: UserData = await new Promise((resolve, reject) => {
    user.getSession((err: any) => {
      if (err) {
        reject(err);
      } else {
        user.getUserData((err, result) => {
          if (err) {
            reject(err);
          } else {
            if (result) {
              resolve(result);
            } else {
              reject(new Error('Failed to fetch user data'));
            }
          }
        });
      }
    });
  });

  const publicModelVersions = await rpcClient.listPublicModelVersions();
  console.log(userData);
  const privateModelVersions = await rpcClient.listPrivateModelVersions({
    publisher: userData.Username,
  });

  const allModelVersions = [...publicModelVersions, ...privateModelVersions];
  const uniqueIds = [...new Set(allModelVersions.map(({ id }) => id))];
  echo(uniqueIds.join('\n'));
}
