import { createLeaf } from '@alwaysai/always-cli';
const pkg = require('../package.json');

export const version = createLeaf({
  name: 'version',
  description: "Print this command's version and exit",
  action() {
    return pkg.version;
  },
});
