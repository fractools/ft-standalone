const expect = require('expect');
const pkg = require('../../package');
const testdata = require('./testdata/users.testdata');

describe('Users', function () {
  let users;
  let userList = testdata.userList;
  let userDataList = testdata.userDataList;

  beforeEach(async function () {
    pkg.testing = true;
    const Users = require('../lib/users');
    users = new Users();
  });

  it('should add and list a new user', async function () {
    const newUser = testdata.testUsers[0];
    await users.registerUser(newUser);
    let userTestList = await users.listAllUsers();
    let postedUser = await users.getUser(newUser.username);
    expect(newUser.username).toEqual(postedUser.username);
  });

  it('should list all users', async function () {
    testdata.testUsers.forEach(async (user) => await users.registerUser(user));
    let userTestList = await users.listAllUsers();
    expect(userTestList.length).toEqual(4);
  });

  it('should remove user', async function () {
    const newUser = testdata.testUsers[0];
    await users.registerUser(newUser);
    await users.removeUser(newUser.username);
    let userTestList = await users.listAllUsers();
    expect(userTestList.length).toEqual(0);
  });

  it('should update user', async function () {
    const newUser = testdata.testUsers[0];
    await users.registerUser(newUser);
    let userToUpdate = await users.getUser(newUser.username);
    userToUpdate.username = 'Marianne';
    await users.updateUser(userToUpdate);
    let updatedUser = await users.getUser(userToUpdate._id);
    expect(updatedUser.username).toEqual(userToUpdate.username);
  });

  it('should update password', async function () {
    const newUser = testdata.testUsers[0];
    await users.registerUser(newUser);
    let userToUpdate = await users.getUser(newUser.username);
    await users.setNewPassword(userToUpdate, 'newPassword');
    userToUpdate = await users.getUser(newUser.username);
    let result = await users.checkPassword(userToUpdate, 'newPassword');
    expect(result).toEqual('Password matches');
  });

  it('should add new userdata', async function () {
    const userData = testdata.testUserData[0];
    await users.setupUserData(userData);
    let postedUserData = await users.getUserData(userData._id);
    expect(postedUserData).toEqual(userData);
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
