const PouchDB = require('pouchdb'),
      { genRandomString } = require('./tools'),
      pkg = require('../../package'),
      config = require('../fractools.config'),
      server = config.remotePouchDB;

if (!server && !pkg.testing) {
  console.dir(` ######## [ Server Database ] ########  No Remote Server. Replication off.`);
};

class PouchInteractor {

  constructor() {
    this.dbPath = config.databasePath;
  }

  async dbExists(database) {
    let data;
    try {
      let db = new PouchDB(`${this.dbPath}/${database}`);
      let res = await db.allDocs({
        include_docs: true,
        attachments: false
      });
      data = res.rows.map(row => row.doc);
    } catch (e) {
      console.log(e);
    } finally {
      if (data[0]) return true;
      if (!data[0]) return false;
    };
  };

  async dbCreate(database) {
    try {
      let db = new PouchDB(`${this.dbPath}/${database}`);
    } catch (e) {
      console.log(e);
    };
  };

  async replicate(database) {
    try {
      if (server) {
        let db = new PouchDB(`${this.dbPath}/${database}`);
        await db.replicate.to(`http://${server}/${database}`, { live: false, retry: false });
        await db.replicate.from(`http://${server}/${database}`, { live: false, retry: false });
        console.dir(` ######## [ Server Database ] ########  ${database} Replicated`);
      };
    } catch (err) {
      console.dir(` ######## [ Server Database ] ########  ${database} NOT Replicated!`);
      throw new Error(err.message);
    };
  };

  async fetch(database) {
    let db = new PouchDB(`${this.dbPath}/${database}`);
    let data;
    try {
      let alldocs = await db.allDocs({
        include_docs: true,
        attachments: false
      });
      data = alldocs.rows.map(row => row.doc);
    } catch (err) {
      throw new Error(err.message);
    };
    return data;
  };

  async postDoc(database, id, data) {
    let db = new PouchDB(`${this.dbPath}/${database}`);
    try {
      let res = await db.put({
        _id: id,
        ...data
      });
      return res;
    } catch (e) {
      throw new Error(e);
    };
  };

  async putDoc(database, id, data) {
    let db = new PouchDB(`${this.dbPath}/${database}`);
    try {
      let doc = await db.get(id);
      let res = await db.put({
        _id: id,
        _rev: doc._rev,
        ...doc = data
      });
      return res;
    } catch (e) {
      throw new Error(e);
    };
  };

  async getDoc(database, id) {
    let db = new PouchDB(`${this.dbPath}/${database}`);
    try {
      let doc = await db.get(id);
      return doc;
    } catch (e) {
      throw new Error(e);
    };
  };

  async getAll(database) {
    let db = new PouchDB(`${this.dbPath}/${database}`);
    try {
      let res = await db.allDocs({ include_docs: true, attachments: false });
      let docs = res.rows.map(row => row.doc);
      return docs;
    } catch (e) {
      throw new Error(e);
    };
  };

  async remDoc(database, data) {
    let db = new PouchDB(`${this.dbPath}/${database}`);
    try {
      let toRemove = await db.get(data._id);
      let result = await db.remove(toRemove);
      return result;
    } catch (e) {
      throw new Error(e);
    };
  };

  async docCount(database) {
    let db = new PouchDB(`${this.dbPath}/${database}`);
    let dbRemote = new PouchDB(`http://${server}/${database}`);
    let localDocCount;
    let remoteDocCount;

    try {
      try {
        remoteDocCount = await db.info();
      } catch (err) {
        console.log(err.message);
      } finally {
        localDocCount = await db.info();
        let count = { localDocCount, remoteDocCount };
        return count;
      };
    } catch (err) {
      console.log(err);
    };
  };

  async destroyDatabase(database) {
    let db = new PouchDB(`${this.dbPath}/${database}`);
    try {
      let result = await db.destroy(database);
      return result;
    } catch (e) {
      throw new Error(e);
    };
  };

  async dbInit() {
    let databases = [];
    try {
      await this.replicate('databases');
      await this.replicate('settings');
      databases = await fetch('databases'); // TODO Finally
    } catch (err) {
      console.log(err);
    };
    for (let db of databases) {
      try {
        await this.replicate(db.dbname);
      } catch (err) {
        console.log(err);
      };
    };
    console.dir(' ######## [ Server Engine ] ######## Databases Initialized ');
  };

  async authInit() {
    try {
      await this.replicate('user');
    } catch (e) {
      console.error(e);
    } finally {
      await this.fetch('user');
    };
  };
};

module.exports = PouchInteractor;
