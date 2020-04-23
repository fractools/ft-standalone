const PouchDB = require('pouchdb'),
      logger = require('../lib/logger'),
      { saltHashPassword } = require('../lib/tokenizer'),
      PouchInteractor = require('../lib/pouchInteractor'),
      pouch = new PouchInteractor(),
      { genRandomString } = require('../lib/tools');

module.exports = async (socket, io, clients) => {

  try {
    // Fetch and Await User-Database for Authentification
    pouch.authInit();
  } catch (e) {
    console.error('ERROR: ', e);

  } finally {

    socket.on(`login`, async (data, fn) => {
      console.dir(` ######## [ Server Engine ] ######## "${data.username}" logs in `);
      let client = { user: data.username, id: socket.id };

      // Fetch User Credencials
      let users;
      try {
        users = await pouch.fetch('user');
      } catch(err) {
        console.log(err);
      };

      // Get Single User out of Users List via matching Credencials
      let user = users.find(u => u.username === data.username);

      // Try Authentification
      if (user) {
        // Crypto
        let result = saltHashPassword(data.password, user.password.salt);
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

          logger.createLog(socket, 'Authentification', 'info', `Login by "${data.username}"`, client);
          return fn(null, { username: user.username, role: user.role, _id: user._id, token });
        };
        logger.createLog(socket, 'Authentification', 'error', `Wrong password by "${data.username}"`, client);
        return fn({ message: 'Wrong Credentials' }, null);
      };
      logger.createLog(socket, 'Authentification', 'error', `User "${data.username}" not found`, client);
      return fn({ message: 'Wrong Credentials' }, null);
    });

    socket.on('token', async (token, fn) => {
      let users;
      try {
        users = await pouch.fetch('user');
      } catch (e) {
        console.log(e);
      };

      const user = users.find(u => u.token === token);

      if (user) {
        const client = { user: user.username, id: socket.id };
        console.dir(` ######## [ Server Engine ] ######## Login via Token by "${user.username}" `);
        logger.createLog(socket, 'Authentification', 'Info', `Login via Token by "${user.username}"`, { user: user.username, id: socket.id });
        return fn(null, { username: user.username, role: user.role, _id: user._id, token });
      };
      // console.dir(' ######## [ Server Engine ] ######## No valid Token');
      fn({ message: 'No valid token' }, null);
      // logger.createLog(socket, 'Authentification', 'error', `No valid Token`, { user: 'No User found', id: socket.id })
    });


    socket.on('client', (client) => {
      // Add Client to Client-List
      clients.push(client);
      socket.emit(`new-client`, clients);
      socket.broadcast.emit(`new-client`, clients);
    });

    console.dir(` ######## [ Server Engine ] ######## Authentification Initialized `);
  };
};
