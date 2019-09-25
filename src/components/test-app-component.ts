import rimraf = require('rimraf');
import { VENV, TARGET_JSON_FILE_NAME } from '../constants';
import { echoCommandInvocation } from '../util/echo';
import { appStartComponent } from './app-start-component';
import { aai } from '../util/aai';
import { TargetProtocol } from '../util/target-protocol';
import { SshSpawner } from '../util/spawner/ssh-spawner';
import { runWithEchoAndProceedPrompt } from '../util/run-with-echo-and-proceed-prompt';
import { TargetJsonFile } from '../util/target-json-file';
import { TargetPathDefaultValue } from '../util/target-path-default-value';
import { ALWAYSAI_HOME } from '../environment';

export async function testAppComponent(props: {
  yes: boolean;
  reset: boolean;
  targetHostname?: string;
}) {
  const { yes, targetHostname, reset } = props;
  const targetProtocol = targetHostname
    ? TargetProtocol['ssh+docker:']
    : ALWAYSAI_HOME
    ? undefined
    : TargetProtocol['docker:'];

  const targetPath = TargetPathDefaultValue();
  const targetJsonFile = TargetJsonFile();

  if (reset) {
    if (targetJsonFile.exists()) {
      echoCommandInvocation(`rm -f ${TARGET_JSON_FILE_NAME}`);
      targetJsonFile.remove();
    }
  }

  const appConfigureCommandParts = ['app configure'];
  if (yes) {
    appConfigureCommandParts.push('--yes');
  }
  if (targetProtocol) {
    appConfigureCommandParts.push('--protocol', targetProtocol);
  }
  if (targetHostname) {
    appConfigureCommandParts.push('--hostname', targetHostname);
  }
  await aai(appConfigureCommandParts.join(' '), { yes });

  if (reset) {
    if (targetHostname) {
      echoCommandInvocation(`ssh ${targetHostname} rm -rf ${targetPath}`);
      const targetHostSpawner = SshSpawner({ targetHostname });
      await targetHostSpawner.rimraf(targetPath);
    } else {
      echoCommandInvocation('rm -rf models');
      rimraf.sync('models');
      echoCommandInvocation(`rm -rf ${VENV}`);
      rimraf.sync(VENV);
    }
  }

  if (targetJsonFile.exists()) {
    await aai('app deploy', { yes });
  } else {
    await aai('app install', { yes });
  }

  await runWithEchoAndProceedPrompt(appStartComponent, [], {
    yes,
    functionName: 'aai app start',
  });
}
