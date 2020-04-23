const expect = require('expect');
const fs = require('fs');


const { genRandomString, rimraf, stall } = require('../lib/tools');

const pkg = require('../../package');
const config = require('../fractools.config');

const testdata = require('./testdata/users.testdata');


describe('Users', function () {
  let users,
      dbDir;

  before(function () {
    if (!fs.existsSync('testdatabase')) {
      fs.mkdirSync('testdatabase');
    };
  });

  beforeEach(function () {
    pkg.testing = true;
    const Users = require('../lib/users');
    const ranStr = genRandomString(15);
    dbDir = 'testdatabase/' + ranStr;
    config.databasePath = dbDir;
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
    // Arrange
    for (let i = 0; i < testdata.testUsers.length; i++) {
      await users.registerUser(testdata.testUsers[i]);
    };
    // Act
    let userTestList = await users.listAllUsers();
    // Assert
    expect(userTestList.length).toEqual(4);
  });

  it('should remove user', async function () {
    // Arrange
    const userId = genRandomString(15);
    const newUser = testdata.testUsers[0];
    newUser._id = userId;
    await users.registerUser(newUser);
    // Act
    await users.removeUser(newUser);
    // Assert
    let userTestList = await users.listAllUsers();
    expect(userTestList.length).toEqual(0);
  });

  it('should update user', async function () {
    // Arrange
    const userId = genRandomString(15);
    const newUser = testdata.testUsers[0];
    newUser._id = userId;
    await users.registerUser(newUser);
    let userToUpdate = await users.getUser(userId);
    userToUpdate.username = 'Marianne';
    // Act
    await users.updateUser(userToUpdate);
    // Assert
    let updatedUser = await users.getUser(userId);
    expect(updatedUser.username).toEqual(userToUpdate.username);
  });

  it('should update password', async function () {
    // Arrange
    const userId = genRandomString(15);
    const newUser = testdata.testUsers[0];
    newUser._id = userId;
    await users.registerUser(newUser);
    let userToUpdate = await users.getUser(userId);
    // Act
    await users.setNewPassword(userToUpdate, 'newPassword');
    // Assert
    userToUpdate = await users.getUser(userId);
    let result = await users.checkPassword(userToUpdate, 'newPassword');
    expect(result).toEqual('Password matches');
  });

  it('should add new userdata', async function () {
    // Arrange
    const userData = testdata.testUserData[0];
    // Act
    await users.setupUserData(userData);
    // Assert
    let postedUserData = await users.getUserData(userData._id);
    expect(postedUserData._id).toEqual(userData._id);
  });

  it('should list all userdata', async function () {
    // Arrange
    for (let i = 0; i < testdata.testUserData.length; i++) {
      await users.setupUserData(testdata.testUserData[i]);
    };
    // Act
    let userDataTestList = await users.listAllUserData();
    // Assert
    expect(userDataTestList.length).toEqual(4);
  });

  it('should remove userdata', async function () {
    // Arrange
    const userData = testdata.testUserData[0];
    await users.setupUserData(userData);
    // Act
    await users.removeUserData(userData);
    // Assert
    let userDataTestList = await users.listAllUserData();
    expect(userDataTestList.length).toEqual(0);
  });

  it('should update userdata', async function () {
    // Arrange
    const userData = testdata.testUserData[0];
    await users.setupUserData(userData);
    let userDataToUpdate = await users.getUserData(userData._id);
    userDataToUpdate.diplayname = 'Marco';
    // Act
    await users.updateUserData(userDataToUpdate);
    // Assert
    let updatedUser = await users.getUserData(userData._id);
    expect(updatedUser.displayname).toEqual(userDataToUpdate.displayname);
  });

});
