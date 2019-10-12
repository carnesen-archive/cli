import { CredentialsJsonFile } from './credentials-json-file';
import { RandomString } from './random-string';
import tempy = require('tempy');

describe('credentials json file', () => {
  it('has methods for storing items', async () => {
    const credentialsJsonFile = CredentialsJsonFile(tempy.directory());
    const value = RandomString();

    credentialsJsonFile.setItem('foo', value);
    expect(credentialsJsonFile.getItem('foo')).toBe(value);
    credentialsJsonFile.removeItem('foo');
    expect(credentialsJsonFile.getItem('foo')).toBe('');

    credentialsJsonFile.setItem('foo', value);
    expect(credentialsJsonFile.getItem('foo')).toBe(value);

    credentialsJsonFile.clear();
    expect(credentialsJsonFile.getItem('foo')).toBe('');
  });
});
