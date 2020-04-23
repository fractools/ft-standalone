const PouchDB = require('pouchdb'),
      PouchInteractor = require('../lib/pouchInteractor'),
      pouch = new PouchInteractor(),
      pkg = require('../../package'),
      // Import lib
      logger = require('../lib/logger'),
      // Define PouchDB-Remote-Server and Database
      server = pkg.remotePouchDB,
      config = require('../fractools.config'),
      dbPath = config.databasePath;

module.exports = (socket, clients) => {

  // Fetch Documents Count in Database
  socket.on(`docCount`, async (database, fn) => {
    try {
      let data = await pouch.docCount(database);
      fn(null, data);
    } catch (err) {
      fn(err, null);
    };
  });

  socket.on(`dbexists`, async (database, fn) => {
    try {
      let res = await pouch.dbExists(database);
      fn(null, res);
    } catch (err) {
      console.log('err', err);
      fn(err, null);
    };
  });

  // Send and Broadcast new Document
  socket.on(`send-document`, async (database, data, id, fn) => {
    if (!pkg.testing) console.dir(` ######## [ Server Socket ] ######## Add new Data in "${database}"`);
    let client = clients.find(client => client.id === socket.id);
    try {
      let doc = {
        _id: id,
        ...data
      };
      let response = await pouch.postDoc(database, id, doc);
      fn(null, response);
      let docs = await pouch.fetch(database);
      socket.broadcast.emit(`documents`, docs, database);
      socket.emit(`documents`, docs, database);
      logger.createLog(socket, 'Documents', 'info', `Add new Data in "${database}"`, client);
    } catch (err) {
      console.log(err);
      logger.createLog(socket, 'Documents', 'error', `Error adding new Data in "${database}": ${err}`, client);
      fn(err, null);
    };
    try {
      await pouch.replicate(database);
    } catch (err) {
      console.log(err);
    };
  });

  // Send and Broadcast updated Document
  socket.on(`update-document`, async (database, data, id, rev, fn) => {
    if (!pkg.testing) console.dir(` ######## [ Server Socket ] ######## Update Data in "${database}"`);
    let client = clients.find(client => client.id === socket.id);
    let db = new PouchDB(`${dbPath}/${database}`);
    let docs;
    try {
      let doc = await db.get(id);
      let response = await db.put({
        _id: id,
        _rev: doc._rev,
        ...doc = data
      });
      docs = await pouch.fetch(database);
      fn(null, response);
      socket.broadcast.emit(`documents`, docs, database);
      socket.emit(`documents`, docs, database);
      logger.createLog(socket, 'Documents', 'info', `Update Data in "${database}"`, client);
    } catch (err) {
      console.dir(err);
      logger.createLog(socket, 'Documents', 'error', `Error Updating Data in "${database}": ${err}`, client);
      fn(err, null);
    };
    try {
      await pouch.replicate(database);
    } catch (err) {
      console.log(err);
    };
  });

  // Remove and Broadcast removed Document
  socket.on(`remove-document`, async (database, obj, fn) => {
    if (!pkg.testing) console.dir(` ######## [ Server Socket ] ######## Remove Data in "${database}"`);
    let client = clients.find(client => client.id === socket.id);
    let db = new PouchDB(`${dbPath}/${database}`);
    let docs;
    try {
      let doc = await db.get(obj._id);
      let response = await db.remove(doc);
      docs = await pouch.fetch(database);
      fn(null, response);
      socket.broadcast.emit(`documents`, docs, database);
      socket.emit(`documents`, docs, database);
      logger.createLog(socket, 'Documents', 'info', `Remove Data in "${database}"`, client);
    } catch (err) {
      console.dir(err);
      logger.createLog(socket, 'Documents', 'error', `Error Removing Data in "${database}": ${err}`, client);
      fn(err, null);
    };
    try {
      await pouch.replicate(database);
    } catch (err) {
      console.log(err);
    };
  });

  // Get Single Document
  socket.on(`get-document`, async (database, id, fn) => {
    if (!pkg.testing) console.dir(` ######## [ Server Socket ] ######## Get Single Doc from "${database}"`);
    try {
      pouch.dbCreate(database);
      let doc = await pouch.getDoc(database, id);
      fn(null, doc);
    } catch (err) {
      console.dir(err);
      fn(err, null);
    };
  });

  // Fetch Documents to/from Remote
  socket.on(`last-documents`, async (database, fn) => {
    if (!pkg.testing) console.dir(` ######## [ Server Socket ] ######## Fetch Data from "${database}"`);
    try {
      let docs = await pouch.fetch(database);
      fn(null, docs);
    } catch (err) {
      fn(err, null);
    };
    try {
      await pouch.replicate(database);
    } catch (err) {
      console.log(err);
    };
  });

  // Broadcast
  socket.on(`broadcast`, async (database, data) => {
    if (!pkg.testing) console.dir(` ######## [ Server Socket ] ######## Get Single Doc from "${database}"`);
    try {
      socket.broadcast.emit(`documents`, data, database);
      fn(null, doc);
    } catch (err) {
      console.dir(err);
      fn(err, null);
    };
  });

  // Send and Broadcast new Document
  socket.on(`send-db`, async (data, id, fn) => {
    if (!pkg.testing) console.dir(` ######## [ Server Socket ] ######## Add ${data.dbname} in "Databases"`);
    let client = clients.find(client => client.id === socket.id);
    let db = new PouchDB(`${dbPath}/databases`);
    let doc = {
      _id: id,
      ...data
    };
    let docs;
    try {
      let response = await db.put(doc);
      docs = await pouch.fetch('databases');
      fn(null, response);
      socket.broadcast.emit(`new-database`, doc);
      socket.emit(`new-database`, doc);
      socket.broadcast.emit(`documents`, docs, 'databases');
      socket.emit(`documents`, docs, 'databases');
      logger.createLog(socket, 'Documents', 'info', `Add "${data.dbname}" into "Databases"`, client);
    } catch (err) {
      console.log(err);
      logger.createLog(socket, 'Documents', 'error', `Error Putting "${data.dbname}" in "Databases": ${err}`, client);
      fn(err, null);
    };
    try {
      await pouch.replicate('databases');
    } catch (err) {
      console.log(err);
    };
  });

  // Replicate Documents to/from Remote
  socket.on(`replicate-database`, async (database) => {
    if (!pkg.testing) console.dir(` ######## [ Server Socket ] ######## Replicate Data for "${database}"`);
    let db = new PouchDB(`${dbPath}/${database}`);
    await pouch.replicate(db, database);
  });

  // Replicate Documents to/from Remote
  socket.on(`replicateFT`, async (server1, database1, server2, database2) => {
    if (!pkg.testing) console.dir(` ######## [ Server Socket ] ######## Replicate from "${database1}" to "${database2}"`);
    let db = new PouchDB(`${dbPath}/${database1}`);
    await db.replicate.from(`http://${server1}/${database1}`);
    await db.replicate.to(`http://${server2}/${database2}`);
    let db2 = new PouchDB(`${dbPath}/${database2}`);
    await db2.replicate.from(`http://${server2}/${database2}`);
  });
};
