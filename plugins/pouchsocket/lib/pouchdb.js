import socket from '~/plugins/socket.io.js'
import { genid } from '../lib/idgenerator'
import pouchdb from 'pouchdb'

export default {

   // Fetch AllDocs from Pouch
   async fetchAllDocs (database, vuex) {
    console.log(` ######## [ Client Pouch ] ########  Fetch AllDocs from "${database}" on Socket "last-${database}"`)
    let docs = await new Promise(resolve => socket.emit(`last-documents`, database, resolve))

    // Globally via Vuex Store
    if (vuex) {
      let obj = {
        t: db,
        data: await data
      };
      store.commit('stateUpdate', obj)
    }
    return docs;
  },

  // Fetch single Doc from Pouch
  async getDoc (id, database) {
    console.log(` ######## [ Client Pouch ] ########  Fetch single Doc from "${database}" on "doc-${database}"`);
    const doc = await new Promise(resolve => socket.emit(`get-document`, database, id, resolve));
    return doc;
  },

  // Post Doc into Pouch
  postDoc (data, database, user) {
    let id = genid(`${database}`, user)
    console.log(` ######## [ Client Pouch ] ########  Post Doc into "${database}" on "send-${database}"`);
    console.log(data);
    socket.emit(`send-document`, database, data, id)
  },

  // Post Doc into Pouch
  postDocOwnId (data, database, user, id) {
    console.log(` ######## [ Client Pouch ] ########  Post Doc into "${database}" on "send-${database}"`);
    socket.emit(`send-document`, database, data, id)
  },

  // Update Doc on Pouch
  putDoc (data, id, rev, database) {
    console.log(` ######## [ Client Pouch ] ########  Update Doc in "${database}" on "update-${database}"`);
    socket.emit(`update-document`, database, data, id, rev)
  },

  // Remove Doc off Pouch
  remDoc (obj, database) {
    console.log(` ######## [ Client Pouch ] ########  Remove Doc on "${database}" on "remove-${database}"`);
    socket.emit(`remove-document`, database, obj)
  },

  // Replication DB Remote
  replicate (database) {
    console.log(` ######## [ Client Pouch ] ########  Replicate for "${database}"`);
    socket.emit(`replicate-database`)
    let db = new PouchDB(database)
    db.replicate.to(`http://${server}/${database}`)
    db.replicate.from(`http://${server}/${database}`)
  },

  // Post Doc into Pouch
  postDocVerteiler (data, database) {
    let id = genid(`${database}`)
    console.log(` ######## [ Client Pouch ] ########  Post Doc into "${database}" on "send-${database}"`);
    socket.emit(`send-document`, data, id)
  },
}
