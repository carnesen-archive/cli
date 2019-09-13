import rimraf = require('rimraf');
import { readFileSync, writeFileSync } from 'fs';
import { DOCKERFILE, DOCKER_EDGEIQ_REPOSITORY_NAME } from '../constants';
import { findOrWriteDockerfileComponent } from './find-or-write-dockerfile-component';

function readDockerfile() {
  return readFileSync(DOCKERFILE, {
    encoding: 'utf8',
  });
}

describe(findOrWriteDockerfileComponent.name, () => {
  const yes = true;
  it('big test of all the features', async () => {
    // Preserves the docker file if it exists
    writeFileSync(DOCKERFILE, 'foo');
    await findOrWriteDockerfileComponent({ yes });
    expect(readDockerfile()).toBe('foo');

    // Writes the docker file if it does not exist
    rimraf.sync(DOCKERFILE);
    await findOrWriteDockerfileComponent({ yes });
    const contents0 = readDockerfile();
    expect(contents0).toMatch(DOCKER_EDGEIQ_REPOSITORY_NAME);
  });
});
