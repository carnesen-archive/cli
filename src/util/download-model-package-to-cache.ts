import { modelPackageCache } from './model-package-cache';
import { modelPackageCloudClient } from './model-package-cloud-client';

export async function downloadModelPackageToCache(id: string, version: number) {
  const readable = await modelPackageCloudClient.download(id, version);
  await modelPackageCache.write(id, version, readable);
}
