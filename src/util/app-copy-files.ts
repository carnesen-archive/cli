import difference = require('lodash.difference');

import { Spawner } from '../spawner/types';

const IGNORED_FILE_NAMES = ['models', 'node_modules', '.git', 'venv'];

export async function appCopyFiles(source: Spawner, target: Spawner) {
  const allFileNames = await source.readdir();
  const filteredFileNames = difference(allFileNames, IGNORED_FILE_NAMES);
  const readable = await source.tar(...filteredFileNames);
  await target.untar(readable);
}
