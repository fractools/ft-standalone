const Logger = require('../lib/logger');
const Users = require('../lib/users');

const logger = new Logger().getInstance();
const users = new Users();

module.exports = (socket, clients) => {

  socket.on(`register`, async (fullUser, fn) => {
    let client = clients.find(client => client.id === socket.id);
    try {
      let userResult = await users.registerUser(fullUser.user);
      let userDataResult = await users.setupUserData(fullUser.userData);
      // Log after validation
      if (userResult.ok && userDataResult.ok) {
        logger.createLog(socket, 'User Management', 'info', `Register User "${fullUser.user.username}"`, client);
        // Promise Response to Client
        fn(null, 'Registered');
      };
    } catch (err) {
      logger.createLog(socket, 'User Management', 'error', `Failed to Register User "${fullUser.user.username}": ${err}`, client);
      fn(err, null);
      console.log(err);
    };
  });

  socket.on('updateuser', async (user, fn) => {
    let client = clients.find(client => client.id === socket.id);
    try {
      let userResult = await users.updateUser(user);
      // Log after validation
      if (userResult.ok) {
        logger.createLog(socket, 'User Management', 'info', `Update user "${user.username}"`, client);
        fn(null, true);
      }
    } catch (err) {
      logger.createLog(socket, 'User Management', 'error', `Failed to Update user "${user.username}": ${err}`, client);
      fn(err, null);
    };
  });

  socket.on('updateuserdata', async (userData, fn) => {
    let client = clients.find(client => client.id === socket.id);
    try {
      let userDataResult = await users.updateUserData(userData);
      // Log after validation
      if (userDataResult.ok) {
        logger.createLog(socket, 'User Management', 'info', `Update userdata for "${userData._id}"`, client);
        fn(null, true);
      }
    } catch (err) {
      logger.createLog(socket, 'User Management', 'error', `Failed to Update userdata for "${userData._id}": ${err}`, client);
      fn(err, null);
    };
  });

  socket.on('removeuser', async (id, fn) => {
    let client = clients.find(client => client.id === socket.id)
    try {
      let userResult = await users.removeUser(id);
      if (userResult.ok) {
        logger.createLog(socket, 'User Management', 'info', `Remove user "${id}"`, client);
        fn(null, true);
      }
    } catch (err) {
      logger.createLog(socket, 'User Management', 'error', `Failed to Remove user "${id}": ${err}`, client);
      fn(err, null);
    };
  });

  socket.on('removeuserdata', async (id, fn) => {
    let client = clients.find(client => client.id === socket.id)
    try {
      let userDataResult = await users.removeUserData(id);
      if (userDataResult.ok) {
        logger.createLog(socket, 'User Management', 'info', `Remove userdata for "${id}"`, client);
        fn(null, true);
      }
    } catch (err) {
      logger.createLog(socket, 'User Management', 'error', `Failed to Remove userdata for "${id}": ${err}`, client);
      fn(err, null);
    };
  });

  socket.on(`newpassword`, async (user, password, fn) => {
    let client = clients.find(client => client.id === socket.id)
    try {
      let userResult = await users.setNewPassword(user, password);
      // Log after validation
      if (userResult.ok) {
        logger.createLog(socket, 'User Management', 'info', `New Password for user "${user.username}"`, client);
        // Promise Response to Client
        fn(null, 'Registered');
      };
    } catch (err) {
      logger.createLog(socket, 'User Management', 'error', `No New Password for user "${user.username}": ${err}`, client);
      fn(err, null);
      console.log(err);
    };
  });

  socket.on(`checkpassword`, async (user, password, fn) => {
    let client = clients.find(client => client.id === socket.id);
    try {
      const result = await users.checkPassword(user, password);
      fn(null, true);
    } catch (err) {
      fn(err, null);
    };
  });

  socket.on('getalluser', async (fn) => {
    try {
      const userList = await users.listAllUsers();
      // Check for initial user
      !userList[0] ? fn('No User exists', null) : fn(null, userList);
    } catch (err) {
      console.log(err);
      fn(err, null);
    };
  });

  socket.on('getuser', async (id, fn) => {
    try {
      const user = await users.getUser(id);
      fn(null, user);
    } catch (err) {
      fn(err, null);
    };
  });

};
