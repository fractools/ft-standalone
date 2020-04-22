const PouchInteractor = require('./pouchInteractor');

let pkg = require('../../package'),
      config = require('../fractools.config');

const genPouch = require('./genPouch');
const { saltHashPasswordRegister,
        saltHashPassword } = require('./tokenizer'),
      { genRandomString } = require('./tools');

let pouch;

class Users {
  constructor(dbPath) {
    pouch = new PouchInteractor(dbPath);
  };

  async registerUser(user) {
    const saltPW = saltHashPasswordRegister(user.password);
    const userToPost = { ...user, password: saltPW };
    let resUser = await pouch.postDoc('user', userToPost._id, userToPost);
    let fetchUser = await pouch.fetch('user');
    return resUser;
  };

  async updateUser(user) {
    let resUser = await pouch.putDoc('user', user._id, user);
    let fetchUser = await pouch.fetch('user');
    return resUser;
  };

  async removeUser(user) {
    let resUser = await pouch.remDoc('user', user);
    return resUser;
  };

  async setNewPassword(user, password) {
    const saltPW = saltHashPasswordRegister(password);
    const userToUpdate = { ...user, password: saltPW };
    let resUser = await this.updateUser(userToUpdate);
    return resUser;
  };

  async checkPassword(user, password) {
    const userFromDB = await pouch.getDoc('user', user._id);
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
    let userList = await pouch.getAll('user');
    return userList;
  };

  async getUser(id) {
    let user = await pouch.getDoc('user', id);
    return user;
  };

  async setupUserData(userData) {
    let resUserData = await pouch.postDoc('userdata', userData._id, userData);
    let fetchUserData = await pouch.fetch('userdata');
    return resUserData;
  };

  async updateUserData(userData) {
    let resUserData = await pouch.putDoc('userdata', userData._id, userData);
    let fetchUserData = await pouch.fetch('userdata');
    return resUserData;
    return resUserData;
  };

  async removeUserData(userData) {
    let resUserData = await pouch.remDoc('userdata', userData);
    return resUserData;
  };

  async listAllUserData() {
    let userDataList = await pouch.getAll('userdata');
    return userDataList;
  };

  async getUserData(id) {
    let userData = await pouch.getDoc('userdata', id);
    return userData;
  };
};

module.exports = Users;
