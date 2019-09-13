import { AppJsonFile } from './app-json-file';
import * as tempy from 'tempy';
import chalk from 'chalk';

const subject = AppJsonFile(tempy.directory());
const BOLD_NONE = chalk.bold('None');
describe(AppJsonFile.name, () => {
  it('big test of all the methods', () => {
    subject.write({});

    expect(subject.describeModels()).toMatch(`Models: ${BOLD_NONE}`);

    subject.addModel('foo', 0);

    expect(subject.read().models).toEqual({ foo: 0 });
    expect(subject.describeModels()).toMatch('foo@0');

    subject.removeModel('foo');

    expect(subject.read().models).toEqual({});
    expect(subject.describeScripts()).toMatch(`Scripts: ${BOLD_NONE}`);

    subject.write({ scripts: { start: 'python app.py' } });
    expect(subject.describeScripts()).toMatch('start => "python app.py"');
  });
});
