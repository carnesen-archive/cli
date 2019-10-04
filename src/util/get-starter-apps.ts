import fetch from 'node-fetch';
import { SystemDomainName } from '@alwaysai/cloud-api';
import { authenticationClient } from './authentication-client';
import { TerseError } from '@alwaysai/alwayscli';
import pump = require('pump');
import { renameSync, readdirSync, existsSync } from 'fs';
import * as tar from 'tar';
import { systemId } from './cli-config';
import { join } from 'path';
import { PLEASE_REPORT_THIS_ERROR_MESSAGE, ALWAYSAI_STARTER_APPS } from '../constants';
import rimraf = require('rimraf');
import mkdirp = require('mkdirp');

const systemDomainName = SystemDomainName(systemId);
const starterAppsUrl = `https://dashboard.${systemDomainName}/docs/${ALWAYSAI_STARTER_APPS}.tar.gz`;

export async function getStarterApps(dir = process.cwd()) {
  const destinationDir = join(dir, ALWAYSAI_STARTER_APPS);
  if (existsSync(destinationDir)) {
    throw new TerseError(`Directory "${destinationDir}" already exists`);
  }
  const tmpDir = `${destinationDir}.download`;
  rimraf.sync(tmpDir);
  const authorizationHeader = await authenticationClient.getAuthorizationHeader();
  const jwt = authorizationHeader.Authorization.split(' ')[1];
  const cookieHeader = {
    cookie: `token=${jwt}`,
  };
  mkdirp.sync(tmpDir);
  try {
    const response = await fetch(starterAppsUrl, {
      redirect: 'manual',
      headers: { ...cookieHeader },
    });
    if (!response.ok) {
      throw new TerseError(
        `Server responded ${response.status} "${response.statusText}"`,
      );
    }

    await new Promise((resolve, reject) => {
      pump([response.body, tar.extract({ cwd: tmpDir })], err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    const fileNames = readdirSync(tmpDir);
    if (fileNames.length !== 1 || !fileNames[0]) {
      throw new Error(
        `Expected ${ALWAYSAI_STARTER_APPS} package to contain a single directory. ${PLEASE_REPORT_THIS_ERROR_MESSAGE}`,
      );
    }
    await renameSync(join(tmpDir, fileNames[0]), destinationDir);
  } finally {
    rimraf.sync(tmpDir);
  }
}
