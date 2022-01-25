var assert = require('assert');
var fs = require('fs');

describe('npmlog-file', function () {
  var log = require('npmlog');
  var logfile = require('./');

  describe('#write', function () {
    it('should write logs to a file', function () {
      log.level = 'error';

      log.heading = '#write';
      log.silly('spec', 'this is line 1 and i am silly');
      log.verbose('spec', 'this is line 1 and i am verbose');
      log.level = 'silent';
      log.info('spec', 'this is line 1 and i am info');

      log.heading = '#newwrite';
      log.http('spec', 'this is line 1 and i am http');
      log.warn('spec', 'this is line 1 and i am warn');
      log.error('spec', 'this is line 1 and i am error');

      logfile.write(log, 'mocha-write-test.log');

      var contents = [
        '0 silly spec this is line 1 and i am silly',
        '1 verbose spec this is line 1 and i am verbose',
        '2 info spec this is line 1 and i am info',
        '3 http spec this is line 1 and i am http',
        '4 warn spec this is line 1 and i am warn',
        '5 error spec this is line 1 and i am error\n'
      ].join('\n');

      assert.equal(fs.readFileSync('mocha-write-test.log').toString(), contents);
    });
  });
});
