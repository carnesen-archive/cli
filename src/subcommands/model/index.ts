import { CliBranch } from '@alwaysai/alwayscli';
import { modelPublish } from './publish';
import { ALWAYSAI_SHOW_HIDDEN } from '../../environment';

export const model = CliBranch({
  name: 'model',
  hidden: !ALWAYSAI_SHOW_HIDDEN,
  description: 'Publish a model version package to the alwaysAI Cloud',
  subcommands: [modelPublish],
});
