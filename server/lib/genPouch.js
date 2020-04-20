const PouchDB = require('../adaptors/pouchAdaptor'),
      config = require('../fractools.config'),
      pkg = require('../../package'),
      server = config.remotePouchDB;

if (!server && !pkg.testing) {
  console.dir(` ######## [ Server Database ] ########  No Remote Server. Replication off.`);
};

async function dbExists(database) {
  let data;
  try {
    let db = new PouchDB(`./database/${database}`);
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

async function replicate(database) {
  try {
    if (server) {
      let db = new PouchDB(`./database/${database}`);
      await db.replicate.to(`http://${server}/${database}`, { live: false, retry: false });
      await db.replicate.from(`http://${server}/${database}`, { live: false, retry: false });
      console.dir(` ######## [ Server Database ] ########  ${database} Replicated`);
    };
  } catch (err) {
    console.dir(` ######## [ Server Database ] ########  ${database} NOT Replicated!`);
    throw new Error(err.message);
  };
};

async function fetch(database) {
  let db = new PouchDB(`./database/${database}`);
  let data;
  try {
    let alldocs = await db.allDocs({
      include_docs: true,
      attachments: false
    });
    data = alldocs.rows.map(row => row.doc);
  } catch (err) {
    throw new Error(err);
  };
  return data;
};

async function putDoc(database, id, data) {
  let db = new PouchDB(`./database/${database}`);
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

async function postDoc(database, id, data) {
  let db = new PouchDB(`./database/${database}`);
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

async function docCount(database) {
  let db = new PouchDB(`./database/${database}`);
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

async function dbInit() {
  let databases = [];
  try {
    await replicate('databases');
    await replicate('settings');
    databases = await fetch('databases'); // TODO Finally
  } catch (err) {
    console.log(err);
  };
  for (let db of databases) {
    try {
      await replicate(db.dbname);
    } catch (err) {
      console.log(err);
    };
  };
  console.dir(' ######## [ Server Engine ] ######## Databases Initialized ');
};

async function authInit() {
  try {
    await replicate('user');
  } catch (e) {
    console.error(e);
  } finally {
    await fetch('user');
  };
};

module.exports = {
  replicate,
  fetch,
  putDoc,
  postDoc,
  docCount,
  dbInit,
  authInit,
  dbExists
};
