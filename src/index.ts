#!/usr/bin/env node

import { runAndExit } from '@alwaysai/alwayscli';
import { aai } from './aai';

if (module === require.main) {
  runAndExit(aai, ...process.argv.slice(2));
}

export {};
