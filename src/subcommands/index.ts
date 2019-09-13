import { appCliBranch } from './app';
import { config } from './config';
import { user } from './user';
import { rpc } from './rpc';
import { model } from './model';
import { getStarterAppsCliLeaf } from './get-starter-apps';

export const subcommands = [
  appCliBranch,
  user,
  getStarterAppsCliLeaf,
  model,
  rpc,
  config,
];
