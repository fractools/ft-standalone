let PouchDB = require('pouchdb');
const pkg = require('../../package');

class PouchAdaptor {
  constructor(db) {
    this.db = db.substring(db.lastIndexOf('/') + 1);
    this.user = {
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
    this.userdata = {
      rows: [
        {
          id: 'testUser',
          key: 'testUser',
          value: { _rev: '1-xyz' },
          doc: {
            displayname: 'Test',
            vorname: 'Test',
            nachname: 'User',
            email: 'testmail@test.de',
            _id: 'testUser',
            _rev: '1-xyz'
          }
        }
      ]
    };
  };

  allDocs() {
    return this[this.db];
  };

  get(id) {
    let allUserRows = this.allDocs();
    let allUsers = allUserRows.rows.map(row => row.doc);
    return allUsers.filter((user) => user._id === id)[0];
  };

  put(data) {
    let indexToRemove = this[this.db].rows.map(e => e.id).indexOf(data._id);
    if (!data._rev) {
      data._rev = '1-xyz';
    } else {
      let revNum = parseInt(data._rev.split('-')[0]) + 1;
      let revKey = data._rev.split('-')[1];
      let revNew = revNum + '-' + revKey;
      data._rev = revNew;
    };
    let newUser = {
      id: data._id,
      key: data._id,
      value: { _rev: data._rev },
      doc: data
    };
    if (!indexToRemove) {
      this[this.db].rows.splice(0, 1, newUser);
    } else {
      this[this.db].rows.push(newUser);
    }
  };

  remove(id) {
    let indexToRemove = this[this.db].rows.map(e => e.id).indexOf(id.username);
    this[this.db].rows.splice(0, 1);
  };
};


if (pkg.testing) {
  PouchDB = PouchAdaptor;
}

module.exports = PouchDB;
