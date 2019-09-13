import { Spawner } from './spawner/types';

export async function buildDockerImage(hostSpawner: Spawner) {
  const output = await hostSpawner.run({
    exe: 'docker',
    args: ['build', '--quiet', '.'],
    cwd: '.',
  });
  const dockerImageId = output.trim();
  return dockerImageId;
}
