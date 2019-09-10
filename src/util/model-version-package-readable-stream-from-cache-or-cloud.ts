import { createReadStream, existsSync } from 'fs';
import { modelVersionPackageCacheGetPath } from './model-version-package-path';
import { modelVersionPackageCacheDownloadFromCloud } from './model-version-package-cache-download-from-cloud';

export async function modelVersionPackageCacheGetReadableStream(opts: {
  id: string;
  version: number;
}) {
  const { id, version } = opts;
  const modelPackagePath = modelVersionPackageCacheGetPath({ id, version });
  if (!existsSync(modelPackagePath)) {
    await modelVersionPackageCacheDownloadFromCloud({ id, version });
  }
  return createReadStream(modelPackagePath);
}
