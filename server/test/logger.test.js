const expect = require('expect'),
      pkg = require('../../package'),
      { genRandomString, rimraf, stall } = require('../lib/tools'),
      config = require('../fractools.config'),
      fs = require('fs');

let dbPath = './testdatabase';


describe('Logger', function () {

  let logger, dbDir;

  before(function () {
    pkg.testing = true;
    if (!fs.existsSync('testdatabase')) {
      fs.mkdirSync('testdatabase');
    };
    const ranStr = genRandomString(15);
    dbDir = 'testdatabase/' + ranStr;
    config.databasePath = dbDir;
    logger = require('../lib/logger');
  });

  beforeEach(function () {
    pkg.testing = true;
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir);
    };
  });

  afterEach(async function () {
    await stall(10);
    rimraf(`testdatabase/${dbDir}`);
  });

  after(async function () {
    await stall();
    rimraf('testdatabase');
  });

  it('should create a new log', async function () {
    // Act
    let result = await logger.createLog('socket', 'topic', 'level', 'msg', 'client');
    // Assert
    expect(result.ok).toBe(true);
  });

  it('should create 10 logs', async function () {
    // Arrange
    this.timeout(10000);
    let result;
    let counter = 0;
    // Act
    for (let i = 0; i < 10; i++) {
      result = await logger.createLog('socket', 'topic', 'level', 'msg', 'client');
      if (result.ok) {
        counter++;
      }
    };
    // Assert
    expect(counter).toBe(10);
  });

});
