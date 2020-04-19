const PouchDB = require('../adaptors/pouchAdaptor');
const Logger = require('./logger');

const pkg = require('../../package');

const genPouch = require('./genPouch');
const { saltHashPasswordRegister,
        saltHashPassword } = require('./tokenizer');

let logger, userdb, userDatadb;

let fetch;

class Users {
  constructor(){
    logger = new Logger().getInstance();
    userdb = new PouchDB(`./database/user`);
    userDatadb = new PouchDB(`./database/userdata`);

    fetch = genPouch.fetch;
  };

  async registerUser(user) {
    const saltPW = saltHashPasswordRegister(user.password);
    const userToPost = { ...user, password: saltPW };
    let resUser = await userdb.put(userToPost);
    let fetchUser = await fetch('user');
    return resUser;
  };

  async updateUser(user) {
    let userInDB = await userdb.get(user._id);
    let resUser = await userdb.put({
      _id: user._id,
      _rev: userInDB._rev,
      ...user
    });
    let fetchUser = await fetch('user');
    return resUser;
  };

  async removeUser(id) {
    let userInDB = await userdb.get(id);
    let resUser = await userdb.remove(userInDB);
    return resUser;
  };

  setNewPassword(user, password) {
    const saltPW = saltHashPasswordRegister(password);
    const userToUpdate = { ...user, password: saltPW };
    let result = this.updateUser(userToUpdate);
    return result;
  };

  async checkPassword(user, password) {
    const userFromDB = await userdb.get(user._id);
    const result = saltHashPassword(password, userFromDB.password.salt);
    return await new Promise((resolve, reject) => {
      if (result.passwordHash === user.password.passwordHash) {
        return resolve('Password matches');
      } else {
        return reject('Password does not match');
      };
    });
  };

  async listAllUsers() {
    let userList = [];
    let userrow = await userdb.allDocs({ include_docs: true, attachments: false });
    userList = userrow.rows.map(row => row.doc);
    return userList;
  };

  async getUser(id) {
    let user = await userdb.get(id);
    return user;
  };

  async setupUserData(userData) {
    let resUserData = await userDatadb.put(userData);
    let fetchUserData = await fetch('userdata');
    return resUserData;
  };

  async updateUserData(userData) {
    let userDataInDB = await userDatadb.get(userData._id);
    let resUserData = await userDatadb.put({
      _id: userData._id,
      _rev: userDataInDB._rev,
      ...userData
    });
    let fetchUserData = await fetch('userdata');
    return resUserData;
  };

  async removeUserData(id) {
    let userDataInDB = await userDatadb.get(id);
    let resUserData = await userDatadb.remove(userDataInDB);
    return resUserData;
  };

  async listAllUserData() {
    let userDataList = [];
    let userDatarow = await userDatadb.allDocs({ include_docs: true, attachments: false });
    userDataList = userDatarow.rows.map(row => row.doc);
    return userDataList;
  };

  async getUserData(id) {
    let userData = await userDatadb.get(id);
    return userData;
  };
};

module.exports = Users;
