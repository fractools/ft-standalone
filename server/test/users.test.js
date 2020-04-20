const expect = require('expect');
const pkg = require('../../package');
const testdata = require('./testdata/users.testdata');
const { genRandomString } = require('../lib/tokenizer');
const fs = require('fs');
const path = require('path');

describe('Users', function () {
  let users;
  let userList = testdata.userList;
  let userDataList = testdata.userDataList;
  let dbDir;

  let rimraf = function (dir_path) {
    if (fs.existsSync(dir_path)) {
      fs.readdirSync(dir_path).forEach(function(entry) {
        var entry_path = path.join(dir_path, entry);
        if (fs.lstatSync(entry_path).isDirectory()) {
          rimraf(entry_path);
        } else {
          fs.unlinkSync(entry_path);
        }
      });
      fs.rmdirSync(dir_path);
    }
  };

  let stall = async function(stallTime = 200) {
    await new Promise(resolve => setTimeout(resolve, stallTime));
  };

  before(function () {
    fs.mkdirSync('testdatabase');
  });

  beforeEach(function () {
    pkg.testing = true;
    const Users = require('../lib/users');
    const ranStr = genRandomString(15);
    dbDir = 'testdatabase/' + ranStr;
    fs.mkdirSync(dbDir);
    users = new Users(dbDir);
  });

  after(async function () {
    await stall();
    rimraf('testdatabase');
  });

  it('should add and list a new user', async function () {
    // Arrange
    const userId = genRandomString(15);
    const newUser = testdata.testUsers[0];
    newUser._id = userId;
    // Act
    await users.registerUser(newUser);
    let userTestList = await users.listAllUsers();
    let postedUser = await users.getUser(userId);
    // Assert
    expect(newUser.username).toEqual(postedUser.username);
  });

  it('should list all users', async function () {
    testdata.testUsers.forEach(async (user) => await users.registerUser(user));
    let userTestList = await users.listAllUsers();
    expect(userTestList.length).toEqual(4);
  });

  it('should remove user', async function () {
    const userId = genRandomString(15);
    const newUser = testdata.testUsers[0];
    newUser._id = userId;
    await users.registerUser(newUser);
    await users.removeUser(userId);
    let userTestList = await users.listAllUsers();
    expect(userTestList.length).toEqual(0);
  });

  it('should update user', async function () {
    const userId = genRandomString(15);
    const newUser = testdata.testUsers[0];
    newUser._id = userId;
    await users.registerUser(newUser);
    let userToUpdate = await users.getUser(userId);
    userToUpdate.username = 'Marianne';
    await users.updateUser(userToUpdate);
    let updatedUser = await users.getUser(userId);
    expect(updatedUser.username).toEqual(userToUpdate.username);
  });

  it('should update password', async function () {
    const userId = genRandomString(15);
    const newUser = testdata.testUsers[0];
    newUser._id = userId;
    await users.registerUser(newUser);
    let userToUpdate = await users.getUser(userId);
    await users.setNewPassword(userToUpdate, 'newPassword');
    userToUpdate = await users.getUser(userId);
    let result = await users.checkPassword(userToUpdate, 'newPassword');
    expect(result).toEqual('Password matches');
  });

  it('should add new userdata', async function () {
    const userData = testdata.testUserData[0];
    await users.setupUserData(userData);
    let postedUserData = await users.getUserData(userData._id);
    expect(postedUserData._id).toEqual(userData._id);
  });

  it('should list all userdata', async function () {
    testdata.testUserData.forEach(async (userdata) => await users.setupUserData(userdata));
    let userDataTestList = await users.listAllUserData();
    expect(userDataTestList.length).toEqual(4);
  });

  it('should remove userdata', async function () {
    const userData = testdata.testUserData[0];
    await users.setupUserData(userData);
    await users.removeUserData(userData._id);
    let userDataTestList = await users.listAllUserData();
    expect(userDataTestList.length).toEqual(0);
  });

  it('should update userdata', async function () {
    const userData = testdata.testUserData[0];
    await users.setupUserData(userData);
    let userDataToUpdate = await users.getUserData(userData._id);
    userDataToUpdate.diplayname = 'Marco';
    await users.updateUserData(userDataToUpdate);
    let userTestList = await users.listAllUserData();
    let updatedUser = await users.getUserData(userData._id);
    expect(updatedUser.displayname).toEqual(userDataToUpdate.displayname);
  });

});
