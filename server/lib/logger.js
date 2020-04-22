const moment = require('moment'),
      { postDoc, fetch } = require('./genPouch'),
      { genRandomString } = require('./tools'),
      PouchInteractor = require('./pouchInteractor'),
      config = require('../fractools.config'),
      dbPath = config.databasePath;

moment.locale('de');

let pouch;

class Logger {
  constructor(dbPath) {
    pouch = new PouchInteractor(dbPath);
  };

  async createLog(socket, topic, level, msg, client) {
    let user = 'Node';
    let socketid = 'Node';
    if (client && client.user && client.id) {
      user = client.user;
      socketid = client.id;
    }
    const log = {
      time: moment().format(),
      label: topic,
      level: level,
      message: msg,
      user: user,
      socketid: socketid
    };

    let result = await pouch.postDoc('logs', `${log.time}-${genRandomString(3)}`, log);

    let docs = await pouch.fetch('logs');
    if (socket && socket.broadcast) {
      socket.broadcast.emit(`documents`, docs, 'logs');
      socket.emit(`documents`, docs, 'logs');
    };
    return result;
  };

  async listAllLogs() {
    let logList = await fetch('logs');
    return logList;
  };
};

module.exports = new Logger(dbPath);
