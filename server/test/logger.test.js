const expect = require('expect'),
      pkg = require('../../package'),
      { genRandomString } = require('../lib/tokenizer');

describe('Logger', () => {

  let logger, logs;

  beforeEach(() => {
    pkg.testing = true;
    const PouchDB = require('../adaptors/pouchAdaptor');
    logs = new PouchDB('./database/logs');
    logger = require('../lib/logger');
  });

  it('should create a new log', async () => {
    let result = await logger.createLog('socket', 'topic', 'level', 'msg', 'client');
    expect(result.ok).toBe(true);
  });

  it('should create 20 logs', async () => {
    let result;
    let counter = 0;
    for (let i = 0; i < 20; i++) {
      result = await logger.createLog('socket', 'topic', 'level', 'msg', 'client');
      if (result.ok) {
        counter++;
      }
    };
    expect(counter).toBe(20);
  });

  it('logger should be singelton', async () => {
    let logger = require('../lib/logger');
    let token = genRandomString(25);
    logger.token = token;
    secondLogger = require('../lib/logger');
    expect(logger).toEqual(secondLogger);
  });
});
