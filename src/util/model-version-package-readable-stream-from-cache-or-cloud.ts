import { createReadStream, existsSync } from 'fs';
import { modelVersionPackageCacheGetPath } from './model-version-package-path';
import { modelVersionPackageCacheDownloadFromCloud } from './model-version-package-cache-download-from-cloud';

export async function modelVersionPackageCacheGetReadableStream(opts: {
  id: string;
  version: number;
  bearerToken: string;
}) {
  const { id, version, bearerToken } = opts;
  const modelPackagePath = modelVersionPackageCacheGetPath({ id, version });
  if (!existsSync(modelPackagePath)) {
    await modelVersionPackageCacheDownloadFromCloud({ id, version, bearerToken });
  }
  return createReadStream(modelPackagePath);
}
