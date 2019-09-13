import fetch from 'node-fetch';
import { SystemDomainName } from '@alwaysai/cloud-api';
import { systemId } from './cli-config';
import { authenticationClient } from './authentication-client';

const systemDomainName = SystemDomainName(systemId);
const starterAppsUrl = `https://dashboard.${systemDomainName}/docs/alwaysai-starter-apps.zip`;

export async function downloadStarterApps(dir: string) {
  const authorizationHeader = await authenticationClient.getAuthorizationHeader();
  const response = await fetch(starterAppsUrl, {
    headers: { ...authorizationHeader },
  });
}
