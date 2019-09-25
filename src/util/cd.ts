import { echoCommandInvocation } from './echo';

export function cd(path: string) {
  echoCommandInvocation(`cd ${path}`);
  process.chdir(path);
}
