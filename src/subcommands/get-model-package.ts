import { CliLeaf, CliStringInput, CliNumberInput } from '@alwaysai/alwayscli';
import { checkUserIsLoggedInComponent } from '../components/check-user-is-logged-in-component';
import { yesCliInput } from '../cli-inputs/yes-cli-input';
import { CliRpcClient } from '../util/rpc-client';
import { modelPackageCache } from '../util/model-package-cache';
import { downloadModelPackageToCache } from '../util/download-model-package-to-cache';
import { createWriteStream } from 'fs';
import { ModelId } from '../util/model-id';
import { runWithSpinner } from '../util/run-with-spinner';
import pump = require('pump');
import { ALWAYSAI_SHOW_HIDDEN } from '../environment';

export const getModelPackageCliLeaf = CliLeaf({
  name: 'get-model-package',
  description: 'Get a model package',
  hidden: !ALWAYSAI_SHOW_HIDDEN,
  namedInputs: {
    id: CliStringInput({
      description: 'An alwaysAI model ID, e.g. alwaysai/mobilenet_ssd',
      required: true,
    }),
    version: CliNumberInput({
      description: 'The version number of the model',
    }),
    yes: yesCliInput,
  },
  async action(_, { yes, id, version: maybeVersion }) {
    const { publisher, name } = ModelId.parse(id);
    await checkUserIsLoggedInComponent({ yes });
    const version =
      maybeVersion || (await CliRpcClient().getModelVersion({ id })).version;
    const fileName = `${publisher}-${name}-${version}.tar.gz`;
    await runWithSpinner(
      async () => {
        if (!modelPackageCache.has(id, version)) {
          await downloadModelPackageToCache(id, version);
        }
        await new Promise((resolve, reject) => {
          pump(modelPackageCache.read(id, version), createWriteStream(fileName), err => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
      },
      [],
      `Getting ${fileName}`,
    );
  },
});
