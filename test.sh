#!/bin/bash

set -o errexit
set -o xtrace

npm run lint
npm run build
if [ "$1" == "--ci" ]; then
  node lib config set --systemId development
  node lib user login --email dev@alwaysai.co --password ${ALWAYSAI_CLOUD_PASSWORD} --yes
fi
npm run test:unit
