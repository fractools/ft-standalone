import Vuex from 'vuex'
import socket from '~/plugins/socket.io.js'
import { fetchDBs } from  './databases'

// Data Fetch of Databases for Vuex Store
export async function commit2Store ({ store }) {
  // Fetch List of Databases
  let databases = await fetchDBs(socket);

// console.log(store.state.backend);

  // Check Socket Connection
  if (store.state.backend.connectivity) {
    // Replicate each Database
    for (let db of databases) {
      // Replicates and fetches Databases from RemoteDB-Server via Node to Client
      let data = await new Promise((resolve, reject) => {
        socket.emit('last-documents', db, (err, result) => {
          if (err) return reject(err);
          return resolve(result);
        })
      })
      let obj = {
        t: db,
        data: await data
      }
      store.commit('stateUpdate', obj)

      // Fetch Doc Count
      let count = await new Promise((resolve, reject) => {
        socket.emit('docCount', db, (err, result) => {
          if (err) return reject(err);
          return resolve(result);
        })
      })
      // Prepare Data for dynamic Vuex Store Commit
      let localTarget = {
        t: db,
        count: count.localDocCount.doc_count // Vuex Count
      }
      // Commit local count into Vuex Store
      store.commit('dbCountUpdate', localTarget);
      if (count.remoteDocCount != undefined) {
        let remoteTarget = {
          t: db,
          remoteCount: count.remoteDocCount.doc_count
        }
        // Commit remote count into Vuex Store
        store.commit('dbRemoteCountUpdate', remoteTarget);
      }

      // prepare text for logging
      let localCount = `local: ${count.localDocCount.doc_count}`;
      let remoteCount = `no connection to remote`;
      if (count.remoteDocCount != undefined) {
        remoteCount = `remote: ${count.remoteDocCount.doc_count}`
      }

      console.log(` ######## [ Initial Fetch ] ########  Commit Data from "${db}" into Vuex Store: ${localCount} / ${remoteCount}`);
    }
  };
  store.commit('fetchReadyAll');
  store.commit('initFetchReadyMenuShown');
}
