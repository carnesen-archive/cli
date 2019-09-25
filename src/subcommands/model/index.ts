import { createBranch } from '@alwaysai/alwayscli';
import { modelPublish } from './publish';
import { ALWAYSAI_SHOW_HIDDEN } from '../../environment';

export const model = createBranch({
  name: 'model',
  hidden: !ALWAYSAI_SHOW_HIDDEN,
  description: 'Publish a model version package to the alwaysAI Cloud',
  subcommands: [modelPublish],
});
