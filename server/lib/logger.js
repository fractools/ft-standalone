const moment = require('moment'),
      { postDoc, fetch } = require('./genPouch'),
      { genRandomString } = require('./tokenizer');

moment.locale('de');

class Logger {
  constructor() {

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
    try {
      await postDoc('logs', `${log.time}${genRandomString(3)}`, log);
    } catch (e) {
      console.log(e);
    }
    // Update and Broadcast Client Logs
    try {
      let docs = await fetch('logs');
      if (socket && socket.broadcast) {
        socket.broadcast.emit(`documents`, docs, 'logs');
        socket.emit(`documents`, docs, 'logs');
      }
    } catch (e) {
      console.log(e);
    }
  }
}

class SingeltonLogger {
  constructor() {
    if (!SingeltonLogger.instance) {
      SingeltonLogger.instance = new Logger();
    }
  };

  getInstance() {
    return SingeltonLogger.instance;
  }
}

module.exports = SingeltonLogger;
