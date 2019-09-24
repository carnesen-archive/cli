import { appCliBranch } from './app';
import { config } from './config';
import { user } from './user';
import { rpc } from './rpc';
import { model } from './model';
import { getStarterAppsCliLeaf } from './get-starter-apps';
import { underscoreTestStarterAppsCliLeaf } from './_test-starter-apps';
import { underscoreTestScratchAppCliLeaf } from './_test-scratch-app';
import { getModelPackageCliLeaf } from './get-model-package';

export const subcommands = [
  appCliBranch,
  user,
  getStarterAppsCliLeaf,
  getModelPackageCliLeaf,
  model,
  rpc,
  config,
  underscoreTestStarterAppsCliLeaf,
  underscoreTestScratchAppCliLeaf,
];
