const moment = require('moment'),
      { postDoc, fetch } = require('./genPouch'),
      { genRandomString } = require('./tokenizer')
      Stack = require('./stack');

moment.locale('de');

class Logger {
  constructor(){
    this.Stack = new Stack();
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

    this.Stack.push(log);
    return this.clearStack();
  };

  async clearStack() {
    let current, result;
    while (current = this.Stack.pop()) {
      try {
        result = await postDoc('logs', `${current.time}${genRandomString(3)}`, current);
      } catch (e) {
        console.log(e);
      }
    };
    return result;
  };

  async listAllLogs() {
    let logList = await fetch('logs');
    return logList;
  };
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
