const expect = require('expect');
const fs = require('fs');
const express = require('express');
const socketIO  = require('socket.io');
const http = require('http');
const PouchInteractor = require('../lib/pouchInteractor');

const { genRandomString, rimraf, stall } = require('../lib/tools');

const pkg = require('../../package');
const config = require('../fractools.config');

const testdata = require('./testdata/testdocuments');

describe('Socket DB-Manager', function () {

  // Setup testing variables
  let dbDir, pouch, socket, HOST, PORT;

  before(function () {
    // create database storage directory for testing
    if (!fs.existsSync('testdatabase')) {
      fs.mkdirSync('testdatabase');
    };

    // configure enviroment for testing
    pkg.testing = true;
    PORT = 4000;
    HOST = process.env.baseurl || pkg.config.nuxt.host;

    // Set database path for testing
    const ranStr = genRandomString(15);
    dbDir = 'testdatabase/' + ranStr;
    config.databasePath = dbDir;

    // Instantiate Pouch Pouch Interactor
    pouch = new PouchInteractor();

    // Setup Test Socket Server
    let app = express();
    let server = http.createServer(app);
    let io = socketIO(server);
    io.on('connection', (socket) => {
      let clients = [];
      require('../sockets/dbmanagement')(socket, clients);
    });
    server.listen(PORT, HOST);
  });

  beforeEach(function () {
    // Setup Test Socket Client
    const io = require('socket.io-client');
    socket = io.connect(`${pkg.socketProtocol}${HOST}:${PORT}/`);

    // create database storage directory for testing
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir);
    };
  });

  afterEach(async function () {
    await stall(); // wait fo finish all db interaction
    // Destroy testing database
    await pouch.destroyDatabase('test');
  });

  after(async function () {
    await stall(25); // wait fo finish all db interaction
    // Delete testing database directory
    rimraf('testdatabase');
  });

  it('should post document via socket', async function () {
    // Arrange
    let tempId = genRandomString(15);
    let doc = testdata.simple[0];
    // Act
    // await socket.emit(`send-document`, 'test', doc, tempId, ()=>{});
    let socketRequestResult = await new Promise((resolve, reject) => {
      socket.emit(`send-document`, 'test', doc, tempId, (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      });
    });
    // Assert
    expect(socketRequestResult.ok).toBe(true);
  });

  it('should update document via socket', async function () {
    // Arrange
    let tempId = genRandomString(15);
    let doc = testdata.simple[0];
    let updatedDoc = testdata.simple[1];
    let postedDoc = await pouch.postDoc('test', tempId, doc);
    // Act
    let socketRequestResult = await new Promise((resolve, reject) => {
      socket.emit(`update-document`, 'test', updatedDoc, tempId, postedDoc._rev, (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      });
    });
    // Assert
    expect(socketRequestResult.ok).toBe(true);
  });

  it('should remove document via socket', async function () {
    // Arrange
    let tempId = genRandomString(15);
    let doc = testdata.simple[0];
    await pouch.postDoc('test', tempId, doc);
    let docToRemove = await pouch.getDoc('test', tempId);
    // Act
    let socketRequestResult = await new Promise((resolve, reject) => {
      socket.emit(`remove-document`, 'test', docToRemove, (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      });
    });
    // Assert
    expect(socketRequestResult.ok).toBe(true);
  });

  it('should get document via socket', async function () {
    // Arrange
    let tempId = genRandomString(15);
    let doc = testdata.simple[0];
    await pouch.postDoc('test', tempId, doc);
    // Act
    let socketRequestResult = await new Promise((resolve, reject) => {
      socket.emit(`get-document`, 'test', tempId, (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      });
    });
    // Assert
    expect(socketRequestResult.test).toEqual(doc.test);
  });

  it('should fetch database via socket', async function () {
    // Arrange
    let docs = testdata.simple;
    for (let i = 0; i < docs.length; i++) {
      let tempId = genRandomString(15);
      await pouch.postDoc('test', tempId, docs[i]);
    };
    // Act
    let socketRequestResult = await new Promise((resolve, reject) => {
      socket.emit(`last-documents`, 'test', (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      });
    });
    // Assert
    expect(socketRequestResult.length).toBe(4);
  });

});
