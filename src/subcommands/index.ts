import { appCliBranch } from './app';
import { config } from './config';
import { user } from './user';
import { rpc } from './rpc';
import { model } from './model';
import { getStarterAppsCliLeaf } from './get-starter-apps';
import { testStarterAppsCliLeaf } from './test-starter-apps';
import { testScratchAppCliLeaf } from './test-scratch-app';
import { getModelPackageCliLeaf } from './get-model-package';

export const subcommands = [
  appCliBranch,
  user,
  getStarterAppsCliLeaf,
  getModelPackageCliLeaf,
  model,
  rpc,
  config,
  testStarterAppsCliLeaf,
  testScratchAppCliLeaf,
];
