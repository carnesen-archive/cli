#!/usr/bin/env node

// This file is the entry point for when this package is run as a CLI. Though
// this file is not executable, the above "shebang" line is necessary as an
// indicator to npm that this file is a Node.js script, not a shell script e.g.

import { runCliAndExit } from '@alwaysai/alwayscli';

import { enhancer } from './enhancer';
import { root } from './root';

if (module === require.main) {
  runCliAndExit(root, { enhancer });
}
