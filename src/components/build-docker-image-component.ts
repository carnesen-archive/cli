import { buildDockerImage } from '../util/build-docker-image';
import { Spawner } from '../util/spawner/types';
import ora = require('ora');

export async function buildDockerImageComponent(props: { targetHostSpawner: Spawner }) {
  const BUILD_DOCKER_IMAGE_MESSAGE = 'Build docker image';
  const FIFTEEN_SECONDS = 15 * 1000;

  const spinner = ora(BUILD_DOCKER_IMAGE_MESSAGE).start();
  const timeout = setTimeout(() => {
    spinner.text = `${BUILD_DOCKER_IMAGE_MESSAGE} (this may take several minutes)`;
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
