import { appCliBranch } from './app';
import { config } from './config';
import { user } from './user';
import { rpc } from './rpc';
import { model } from './model';

export const subcommands = [appCliBranch, user, model, rpc, config];
