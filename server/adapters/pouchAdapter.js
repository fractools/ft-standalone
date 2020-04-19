const PouchDB = require('../adapters/pouchAdapter');
const pkg = require('../../package');

class PouchAdapter {
  constructor() {
    this.userList = {
      rows: [
          {
            id: 'testUser',
            key: 'testUser',
            value: { _rev: '1-xyz' },
            doc: {
              username: 'testUser',
              password: { salt: 'xyz', passwordHash: 'xyz' },
              role: 'User',
              token: '123',
              _id: 'testUser',
              _rev: '1-xyz'
          }
        }
      ]
    };
  }

  allDocs() {
    return this.userList;
  };

  get(id) {
    let allUserRows = this.allDocs();
    let allUsers = allUserRows.rows.map(row => row.doc);
    return allUsers.filter((user) => user._id === id)[0];
  };

  put(user) {
    let newUser = {
      id: user._id,
      key: user._id,
      value: { _rev: user._rev },
      doc: user
    };
    this.userList.rows.push(newUser);
  };
};

let pouch = PouchDB;
if (pkg.testing) {
  pouch = PouchAdapter;
}

module.exports = pouch;
