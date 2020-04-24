import Vuex from 'vuex'
import socket from '~/plugins/socket.io.js'
import pkg from '../../../package'

const server = pkg.remoteDatabaseURL

let connectivity = false;

async function connectedSocket(socket) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(socket.connected)
    }, 1000);
  })
}

export async function fetchDBs (socket) {
  // console.log(` ######## [ Client Databases ] ########  Fetch the List of Databases`);
  // Databases
  const database = 'databases'
  let databases = [ database ]
  // Check Socket Connection
  if (await connectedSocket(socket)) {
    // Fetch Data
    let dbs = await new Promise((resolve, reject) => {
      socket.emit('last-documents', database, (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      })
    })
    // Prepare Database-Names for a List
    for (let x of dbs) {
      // Push Database-Names into 'Databases'-Array
      databases.push(x.dbname)
    }
  }
  return databases;
};
