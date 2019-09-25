import { buildDockerImage } from '../util/build-docker-image';
import { Spawner } from '../util/spawner/types';
import { Spinner } from '../util/spinner';

export async function buildDockerImageComponent(props: { targetHostSpawner: Spawner }) {
  const BUILD_DOCKER_IMAGE_MESSAGE = 'Build docker image';
  const FIFTEEN_SECONDS = 15 * 1000;

  const spinner = Spinner(BUILD_DOCKER_IMAGE_MESSAGE);
  const timeout = setTimeout(() => {
    spinner.setMessage(`${BUILD_DOCKER_IMAGE_MESSAGE} (this may take several minutes)`);
  }, FIFTEEN_SECONDS);
  try {
    const dockerImageId = await buildDockerImage(props.targetHostSpawner);
    spinner.succeed();
    return dockerImageId;
  } catch (exception) {
    spinner.fail();
    throw exception;
  } finally {
    clearTimeout(timeout);
  }
}
