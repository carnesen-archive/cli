import { AppConfigFile } from './app-config-file';
import * as tempy from 'tempy';

const subject = AppConfigFile(tempy.directory());

describe(AppConfigFile.name, () => {
  it(`${subject.addModel}`, () => {
    subject.write({});
    subject.addModel('foo', 0);
    expect(subject.read().models).toEqual({ foo: 0 });
  });

  it(`${subject.removeModel}`, () => {
    subject.write({ models: { foo: 1 } });
    subject.removeModel('foo');
    expect(subject.read().models).toEqual({});
  });
});
