import { testASpawner } from './test-a-spawner';
import { DockerSpawner } from './docker-spawner';
import { DOCKER_EDGEIQ_REPOSITORY_NAME } from '../../constants';

if (process.env.TEST_DOCKER_SPAWNER) {
  jest.setTimeout(15000);
  testASpawner(DockerSpawner, { dockerImageId: DOCKER_EDGEIQ_REPOSITORY_NAME });
}

it(DockerSpawner.name, () => {
  // See above. This is here else jest will complain "each file needs to have a test"
});
