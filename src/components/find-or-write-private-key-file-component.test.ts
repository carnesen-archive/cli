import {
  findOrWritePrivateKeyFileComponent,
  PUBLIC_KEY_FILE_COMMENT,
} from './find-or-write-private-key-file-component';
import rimraf = require('rimraf');
import { PRIVATE_KEY_FILE_PATH, PUBLIC_KEY_FILE_PATH } from '../constants';
import { readFileSync } from 'fs';

function readKeys() {
  const priv = readFileSync(PRIVATE_KEY_FILE_PATH, {
    encoding: 'utf8',
  });
  const pub = readFileSync(PUBLIC_KEY_FILE_PATH, {
    encoding: 'utf8',
  });
  return {
    priv,
    pub,
  };
}

describe(findOrWritePrivateKeyFileComponent.name, () => {
  const yes = true;
  it('big test of all the features', async () => {
    rimraf.sync(PRIVATE_KEY_FILE_PATH);
    rimraf.sync(PUBLIC_KEY_FILE_PATH);
    // Writes the private key file if it does not exist
    await findOrWritePrivateKeyFileComponent({ yes });
    const keys0 = readKeys();
    expect(keys0.priv).toMatch('PRIVATE KEY');
    expect(keys0.pub).toMatch(PUBLIC_KEY_FILE_COMMENT);

    // Regenerates public key file if it does not exist but private does
    rimraf.sync(PUBLIC_KEY_FILE_PATH);
    await findOrWritePrivateKeyFileComponent({ yes });
    const keys1 = readKeys();
    expect(keys0.pub).toMatch(keys1.pub.trim());
    // ^^ Comment is not retained in the regenerated public key

    // Make sure the pub key gets recreated we remove the private but not the public
    rimraf.sync(PRIVATE_KEY_FILE_PATH);
    await findOrWritePrivateKeyFileComponent({ yes });
    const keys2 = readKeys();
    expect(keys0.pub).not.toMatch(keys2.pub.trim());
  });
});
