import Vue from 'vue'
import socket from '~/plugins/socket.io.js'
import { genid } from '../lib/idgenerator'
import pkg from '~/package'

const server = pkg.remoteDatabaseURL;


// Fetch AllDocs from PouchDB
Vue.prototype.$fetchAllDocs = async function (database) {
  console.log(` ######## [ Client Pouch ] ########  Fetch AllDocs from "${database}"`);
  return await new Promise((resolve, reject) => {
    socket.emit(`last-documents`, database, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

// Fetch single Doc from PouchDB
Vue.prototype.$getDoc = async function (id, database) {
  console.log(` ######## [ Client Pouch ] ########  Fetch single Doc from "${database}"`);
  return await new Promise((resolve, reject) => {
    socket.emit(`get-document`, database, id, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

// Post Doc into PouchDB
Vue.prototype.$postDoc = async function (data, database, user) {
  console.log(` ######## [ Client Pouch ] ########  Post Doc into "${database}"`);
  let id = genid(`${database}`, user)
  return await new Promise((resolve, reject) => {
    socket.emit(`send-document`, database, data, id, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

// Post Doc into PouchDB
Vue.prototype.$postDocOwnId = async function (data, database, user, id) {
  console.log(` ######## [ Client Pouch ] ########  Post Doc into "${database}"`);
  return await new Promise((resolve, reject) => {
    socket.emit(`send-document`, database, data, id, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
  socket.emit(`send-document`, database, data, id)
};

// Update Doc on PouchDB
Vue.prototype.$putDoc = async function (data, id, rev, database) {
  console.log(` ######## [ Client Pouch ] ########  Update Doc in "${database}"`);
  return await new Promise((resolve, reject) => {
    socket.emit(`update-document`, database, data, id, rev, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

// Remove Doc off PouchDB
Vue.prototype.$remDoc = async function (obj, database) {
  console.log(` ######## [ Client Pouch ] ########  Remove Doc on "${database}"`);
  return await new Promise((resolve, reject) => {
    socket.emit(`remove-document`, database, obj, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

// Replication DB Remote
Vue.prototype.$replicate = async function (database) {
  console.log(` ######## [ Client Pouch ] ########  Replicate for "${database}"`);
  return await new Promise((resolve, reject) => {
    socket.emit(`replicate-database`, database, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

// Post Doc into PouchDB
Vue.prototype.$postDB = async function (data, user) {
  console.log(` ######## [ Client Pouch ] ########  Post DB into "Databases"`);
  let id = genid(`databases`, user)
  return await new Promise((resolve, reject) => {
    socket.emit(`send-db`, data, id, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

// Replication DB Remote
Vue.prototype.$replicateFT = async function (server1, database1, server2, database2) {
  console.log(` ######## [ Client Pouch ] ########  Replicate from "${database1}" to "${database2}"`);
  return await new Promise((resolve, reject) => {
    socket.emit(`replicateFT`, server1, database1, server2, database2, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};
