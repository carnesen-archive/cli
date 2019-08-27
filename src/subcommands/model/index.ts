import { createBranch } from '@alwaysai/alwayscli';
import { modelPublish } from './publish';

export const model = createBranch({
  name: 'model',
  hidden: true,
  description: 'Publish a model version package to the alwaysAI Cloud',
  subcommands: [modelPublish],
});
