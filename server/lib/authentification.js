const logger = require('../lib/logger'),
      { genRandomString, readCookie } = require('../lib/tools'),
      { saltHashPassword } = require('../lib/tokenizer'),
      PouchInteractor = require('../lib/pouchInteractor'),
      pouch = new PouchInteractor();

let auth = async function (socket, next) {
  let handshake = socket.request;
  let token;

  if (handshake.headers.cookie) {
    token = readCookie('token', handshake.headers.cookie)
  }

  let users;
  try {
    users = await pouch.fetch('user');
  } catch (e) {
    console.log(e);
  };

  if (token) {
    let user = users.find(u => u.token === token);
    if (user) {
      console.dir(` ######## [ Server Engine ] ######## Login via Token by "${user.username}" `);
      next();
    } else {
      next(new Error('No valid token!'));
    }
  } else if (socket.handshake.query.username && socket.handshake.query.password) {
    let user = users.find(u => u.username === socket.handshake.query.username);
    let client = { user: socket.handshake.query.username, id: 'PreAuth' };

    // Try Authentification
    if (user) {
      // Crypto
      let result = saltHashPassword(socket.handshake.query.password, user.password.salt);
      if (result.passwordHash === user.password.passwordHash) {

        // Generate Token for Autologin via Cookie
        let token = genRandomString(16);
        // Add Token to User
        user = { ...user, token };

        try {
          await pouch.putDoc('user', user._id, user);
        } catch (e) {
          console.log(e);
        };

        logger.createLog(socket, 'Authentification', 'info', `Login by "${socket.handshake.query.password}"`, client);
        next();
        // return fn(null, { username: user.username, role: user.role, _id: user._id, token });
      };
      logger.createLog(socket, 'Authentification', 'error', `Wrong password by "${socket.handshake.query.password}"`, client);
      next(new Error('Wrong password!'));
      // return fn({ message: 'Wrong Credentials' }, null);
    };
    logger.createLog(socket, 'Authentification', 'error', `User "${socket.handshake.query.password}" not found`, client);
    next(new Error('User not found!'));
    // return fn({ message: 'Wrong Credentials' }, null);
  }
}

module.exports = auth;
