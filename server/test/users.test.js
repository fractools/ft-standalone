const expect = require('expect');
const pkg = require('../../package');

describe('Users', () => {
  let users;
  let userList = [
    {
      username: 'testUser',
      password: { salt: 'xyz', passwordHash: 'xyz' },
      role: 'User',
      token: '123',
      _id: 'testUser',
      _rev: '1-xyz'
    }
  ];
  let userDataList = [
    {
      displayname: 'Test',
      vorname: 'Test',
      nachname: 'User',
      email: 'testmail@test.de',
      _id: 'testUser',
      _rev: '1-xyz'
    }
  ]

  beforeEach(async () => {
    pkg.testing = true;
    const Users = require('../lib/users');
    users = new Users();
  });

  it('should list a single user', async () => {
    let userTest = await users.getUser('testUser');
    expect(userTest).toEqual(userList[0]);
  });

  it('should list all users', async () => {
    let userTestList = await users.listAllUsers();
    expect(userTestList).toEqual(userList);
  });

  it('should add a new user', async () => {
    const newUser = {
      _id: 'testUser2',
      username: 'testUser2',
      password: 'test',
      role: 'User'
    };
    await users.registerUser(newUser);
    let userTestList = await users.listAllUsers();
    let postedUser = await users.getUser('testUser2');
    expect(postedUser).toEqual(userTestList[1]);
  });

  it('should remove user', async () => {
    await users.removeUser('testUser');
    let userTestList = await users.listAllUsers();
    expect(userTestList.length).toEqual(0);
  });

  it('should update user', async () => {
    let userToUpdate = await users.getUser('testUser');
    userToUpdate.username = 'updatedTestUser';
    await users.updateUser(userToUpdate);
    let userTestList = await users.listAllUsers();
    let updatedUser = await users.getUser('testUser');
    expect(updatedUser.username).toEqual(userToUpdate.username);
  });

  it('should update password', async () => {
    let userToUpdate = await users.getUser('testUser');
    await users.setNewPassword(userToUpdate, 'newPassword');
    userToUpdate = await users.getUser('testUser');
    let result = await users.checkPassword(userToUpdate, 'newPassword');
    expect(result).toEqual('Password matches');
  });

  it('should add new userdata', async () => {
    const userData = {
      _id: 'testUser',
      displayname: 'Test',
      vorname: 'Test',
      nachname: 'User',
      email: 'testmail@test.de',
    };
    await users.setupUserData(userData);
    let postedUserData = await users.getUserData('testUser');
    expect(postedUserData).toEqual(userData);
  });

  it('should list all userdata', async () => {
    let userDataTestList = await users.listAllUserData();
    expect(userDataTestList).toEqual(userDataList);
  });

  it('should remove userdata', async () => {
    await users.removeUserData('testUser');
    let userDataTestList = await users.listAllUserData();
    expect(userDataTestList.length).toEqual(0);
  });

  it('should update userdata', async () => {
    let userDataToUpdate = await users.getUserData('testUser');
    userDataToUpdate.diplayname = 'Marco';
    await users.updateUserData(userDataToUpdate);
    let userTestList = await users.listAllUserData();
    let updatedUser = await users.getUserData('testUser');
    expect(updatedUser.displayname).toEqual(userDataToUpdate.displayname);
  });

});
