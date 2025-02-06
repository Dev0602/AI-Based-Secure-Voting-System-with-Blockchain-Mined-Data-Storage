import assert from 'assert';
import fs from 'fs';
import path from 'path';
import * as services from './index';

describe('index', () => {
  let files;

  beforeAll((done) => {
    fs.readdir(__dirname, (err, _files_) => {
      if (err) {
        done(err);
        return;
      }
      files = _files_;
      done();
    });
  });

  test('should import all services of the src folder', (done) => {
    Promise.all(
      files
        .filter((file) => !['.', '..', 'index.ts'].includes(file))
        .filter((file) => !file.endsWith('.test.ts'))
        .filter((file) => file !== '__snapshots__')
        .filter((file) => !file.endsWith('.d.ts'))
        .filter((file) => !file.endsWith('.mock.ts'))
        .map((file) => require(path.join(__dirname, file)).default), // eslint-disable-line
    )
      .then((modules) => {
        assert.deepEqual(
          Object.keys(services)
            .sort()
            .map((name) => name.replace(/^init(.*)Service$/, 'init$1')),
          modules
            .map((module) => (module as { name: string }).name as string)
            .map((name) => name.replace(/(bound )*/, ''))
            // Also exports LogService defaults/interfaces
            .concat(['DEFAULT_LOG_CONFIG', 'DEFAULT_LOG_ROUTING'])
            .sort(),
        );
      })
      .then(() => done())
      .catch(done);
  });
});
