const PouchInteractor = require('../lib/pouchInteractor'),
      pkg = require('../../package'),
      logger = require('../lib/logger');

module.exports = (socket, clients) => {

  // Send and Broadcast new Document
  socket.on(`send-document`, async (database, data, id, callback) => {
    if (!pkg.testing) console.dir(` ######## [ Server Socket ] ######## Add new Data in "${database}" `);
    let client = clients.find(client => client.id === socket.id);
    let pouch = new PouchInteractor();
    try {
      // Create and Post Document
      let doc = { _id: id, ...data };
      let response = await pouch.postDoc(database, id, doc);
      callback(null, response);
      // Refresh and Broadcast Database State to all Clients
      let docs = await pouch.fetch(database);
      socket.broadcast.emit(`documents`, docs, database);
      socket.emit(`documents`, docs, database);
      logger.createLog(socket, 'Documents', 'info', `Add new Data in "${database}" `, client);
    } catch (err) {
      console.log(err);
      logger.createLog(socket, 'Documents', 'error', `Error adding new Data in "${database}": ${err} `, client);
      callback(err, null);
    };
    try {
      await pouch.replicate(database);
    } catch (err) {
      console.log(err);
    };
  });

  // Send and Broadcast updated Document
  socket.on(`update-document`, async (database, data, id, rev, callback) => {
    if (!pkg.testing) console.dir(` ######## [ Server Socket ] ######## Update Data in "${database}" `);
    let client = clients.find(client => client.id === socket.id);
    let pouch = new PouchInteractor();
    try {
      // Update Document
      let response = await pouch.putDoc(database, id, data);
      callback(null, response);
      // Refresh and Broadcast Database State to all Clients
      let docs = await pouch.fetch(database);
      socket.broadcast.emit(`documents`, docs, database);
      socket.emit(`documents`, docs, database);
      logger.createLog(socket, 'Documents', 'info', `Update Data in "${database}" `, client);
    } catch (err) {
      console.dir(err);
      logger.createLog(socket, 'Documents', 'error', `Error Updating Data in "${database}": ${err} `, client);
      callback(err, null);
    };
    try {
      await pouch.replicate(database);
    } catch (err) {
      console.log(err);
    };
  });

  // Remove and Broadcast removed Document
  socket.on(`remove-document`, async (database, obj, callback) => {
    if (!pkg.testing) console.dir(` ######## [ Server Socket ] ######## Remove Data in "${database}" `);
    let client = clients.find(client => client.id === socket.id);
    let pouch = new PouchInteractor();
    try {
      // Remove Document
      let response = await pouch.remDoc(database, obj);
      callback(null, response);
      // Refresh and Broadcast Database State to all Clients
      let docs = await pouch.fetch(database);
      socket.broadcast.emit(`documents`, docs, database);
      socket.emit(`documents`, docs, database);
      logger.createLog(socket, 'Documents', 'info', `Remove Data in "${database}" `, client);
    } catch (err) {
      console.dir(err);
      logger.createLog(socket, 'Documents', 'error', `Error Removing Data in "${database}": ${err} `, client);
      callback(err, null);
    };
    try {
      await pouch.replicate(database);
    } catch (err) {
      console.log(err);
    };
  });

  // Get Single Document
  socket.on(`get-document`, async (database, id, callback) => {
    if (!pkg.testing) console.dir(` ######## [ Server Socket ] ######## Get Single Doc from "${database}" `);
    let pouch = new PouchInteractor();
    try {
      let doc = await pouch.getDoc(database, id);
      callback(null, doc);
    } catch (err) {
      console.dir(err);
      callback(err, null);
    };
  });

  // Fetch Documents to/from Remote
  socket.on(`last-documents`, async (database, callback) => {
    if (!pkg.testing) console.dir(` ######## [ Server Socket ] ######## Fetch Data from "${database}" `);
    let pouch = new PouchInteractor();
    try {
      let docs = await pouch.fetch(database);
      callback(null, docs);
    } catch (err) {
      callback(err, null);
    };
    try {
      await pouch.replicate(database);
    } catch (err) {
      console.log(err);
    };
  });

  // Fetch Documents Count in Database
  socket.on(`docCount`, async (database, callback) => {
    let pouch = new PouchInteractor();
    try {
      let data = await pouch.docCount(database);
      callback(null, data);
    } catch (err) {
      callback(err, null);
    };
  });

  // Check if database exists and is not empty
  socket.on(`dbexists`, async (database, callback) => {
    let pouch = new PouchInteractor();
    try {
      let res = await pouch.dbExists(database);
      callback(null, res);
    } catch (err) {
      console.log('err', err);
      callback(err, null);
    };
  });

  // Broadcast
  socket.on(`broadcast`, async (database, data) => {
    if (!pkg.testing) console.dir(` ######## [ Server Socket ] ######## Get Single Doc from "${database}" `);
    let pouch = new PouchInteractor();
    try {
      socket.broadcast.emit(`documents`, data, database);
      callback(null, doc);
    } catch (err) {
      console.dir(err);
      callback(err, null);
    };
  });

  // Send and Broadcast new Document
  socket.on(`send-db`, async (data, id, callback) => {
    if (!pkg.testing) console.dir(` ######## [ Server Socket ] ######## Add ${data.dbname} in "Databases" `);
    let pouch = new PouchInteractor();
    let client = clients.find(client => client.id === socket.id);
    let doc = {
      _id: id,
      ...data
    };
    let docs;
    try {
      let response = await pouch.postDoc('databases', id, doc);
      docs = await pouch.fetch('databases');
      callback(null, response);
      socket.broadcast.emit(`new-database`, doc);
      socket.emit(`new-database`, doc);
      socket.broadcast.emit(`documents`, docs, 'databases');
      socket.emit(`documents`, docs, 'databases');
      logger.createLog(socket, 'Documents', 'info', `Add "${data.dbname}" into "Databases" `, client);
    } catch (err) {
      console.log(err);
      logger.createLog(socket, 'Documents', 'error', `Error Putting "${data.dbname}" in "Databases": ${err} `, client);
      callback(err, null);
    };
    try {
      await pouch.replicate('databases');
    } catch (err) {
      console.log(err);
    };
  });

  // Replicate Documents to/from Remote
  socket.on(`replicate-database`, async (database) => {
    if (!pkg.testing) console.dir(` ######## [ Server Socket ] ######## Replicate Data for "${database}" `);
    let pouch = new PouchInteractor();
    await pouch.replicate(database);
  });

  // Replicate Documents to/from Remote
  socket.on(`replicateFT`, async (server1, database1, server2, database2) => {
    if (!pkg.testing) console.dir(` ######## [ Server Socket ] ######## Replicate from "${database1}" to "${database2}" `);
    let pouch = new PouchInteractor();
    await pouch.replicateRemote(server1, database1, server2, database2);
  });
};
