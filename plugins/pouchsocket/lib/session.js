import socket from '~/plugins/socket.io.js';
import pkg from '../../../package';
import { databases } from  './databases';

const host = pkg.backend;

// Connect with Session/Room Socket
export function socketSession ({ store }) {
  if (store.state.authUser && store.state.authUser.role === 'Administrator') {
    console.log(` ######## [ Client Socket ] ########  Connect with Socket ${host}`);
  }

  setTimeout(() => { // TODO Use Hook
    if (store.state.authUser && store.state.authUser.username) {
      socket.emit('client', { id: socket.id, user: store.state.authUser.username });
    }
  }, 1000);

  // Socket
  socket.on(`documents`, async (docs, db) => {
    console.log(` ######## [ Client Socket ] ########  Listen to new Data`);
    let obj = {
      t: db,
      data: await docs
    };
    // Globally via Vuex Store
    store.commit('stateUpdate', obj);
  });

  socket.on('error', (err) => {
    console.log(` ######## [ Client Socket ] ########  Error detected ${err}`);
  });

  socket.on(`new-document`, async (docs) => {
    console.log(` ######## [ Client Socket ] ########  Listen to new Data`);
    let obj = {
      t: db,
      data: await docs
    };
    store.commit('newDoc', obj);
  });

  socket.on(`updated-documents`, (obj) => {
    console.log(` ######## [ Client Socket ] ########  Listen to updated Data`);
    store.commit('updatedDoc', obj);
  });

  socket.on(`removed-document`, (obj) => {
    console.log(` ######## [ Client Socket ] ########  Listen to removed Data`);
    store.commit('removeDoc', obj);
  });

  socket.on('new-client', (clients) => {
    console.log(` ######## [ Client Socket ] ########  Listen to new Client`);
    store.commit('fetchClients', clients);
  });

  socket.emit('clients', (clients) => {
    console.log(` ######## [ Client Socket ] ########  Fetch Clients`);
    store.commit('fetchClients', clients);
  });
};
