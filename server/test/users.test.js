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

  beforeEach(async () => {
    pkg.testing = true;
    const Users = require('../lib/users');
    users = new Users();
  });

  it('should list all users', async () => {
    let userTestList = await users.listAllUsers();
    expect(userTestList).toEqual(userList);
  });

  it('should list a single user', async () => {
    let userTest = await users.getUser('testUser');
    expect(userTest).toEqual(userList[0]);
  });

  it('should post a new user', async () => {
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

});
