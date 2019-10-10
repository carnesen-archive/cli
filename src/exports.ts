// This file is the entry point for when this package is `require`d as a module
import { CliArgvInterface } from '@alwaysai/alwayscli';
import { root } from './root';

export const aai = CliArgvInterface(root);
