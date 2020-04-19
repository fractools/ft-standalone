let PouchDB = require('pouchdb');
const pkg = require('../../package');

class PouchAdaptor {
  constructor(db) {
    this.db = db.substring(db.lastIndexOf('/') + 1);
    this[this.db] = {
      rows: []
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

    if (!data._id) {
      data._id = '1-abc';
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
    };
  };

  remove(id) {
    let indexToRemove = this[this.db].rows.map(e => e.id).indexOf(id.username);
    this[this.db].rows.splice(0, 1);
  };
};

if (pkg.testing) {
  PouchDB = PouchAdaptor;
};

module.exports = PouchDB;
