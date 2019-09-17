#!/usr/bin/env node

import { runAndExit } from '@alwaysai/alwayscli';
import { cli } from './cli';

if (module === require.main) {
  runAndExit(cli, ...process.argv.slice(2));
}

export {};
