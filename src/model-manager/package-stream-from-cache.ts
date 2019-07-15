import { createReadStream, existsSync } from 'fs';
import { ModelPackagePath } from './model-package-path';
import { downloadModelVersionPackage } from './download-model-version-package';

export async function PackageStreamFromCache(opts: { id: string; version: string }) {
  const modelPackagePath = ModelPackagePath(opts);
  if (!existsSync(modelPackagePath)) {
    await downloadModelVersionPackage(opts);
  }
  return createReadStream(modelPackagePath);
}
