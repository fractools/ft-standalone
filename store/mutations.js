import Vue from 'vue'
export default {

  // Sockets
  fetchClients(state, clients) {
    return state.clients = clients;
  },
  fetchDocs(state, docs) {
    return state.documentsdb = docs.data;
  },
  pingRemote (state, remote) {
    return state.pinged.remote = remote
  },
  pingFileserver (state, fileserver) {
    return state.pinged.fileserver = fileserver
  },
  documentsdbUpdate (state, docs) {
    return state.docs = docs;
  },

  newDoc (state, doc) {
    state.documentsdb.push(doc)
  },
  updatedDoc (state, doc) {
    let docs = state.documentsdb.map(obj => l.find(o => o._id === obj._id) || obj);
    return state.documentsdb = docs
  },
  removeDoc (state, doc) {
    let docs = state.documentsdb.filter(v => v._id != doc._id);
    return state.documentsdb = docs;
  },

  // Auth
  SET_USER: function (state, user) {
    state.authUser = user
  },
  
  // SocketConnection
  SOCKET_CONNECTIVITY: function (state, { val, addr }) {
    state.backend.connectivity = val;
    state.backend.address = addr;
  },

  // Iniialize dirst User if not exists
  INIT_USER: function (state, val) {
    state.initUser = val
  },

  // Layout Toggle
  hideMenu (state) {
    return state.menuHidden = !state.menuHidden
  },
  hideAdminPanel (state) {
    return state.adminPanelHidden = !state.adminPanelHidden
  },

  // General Date and Time
  updateDate (state, date) {
    return state.date = date
  },

  // tools
  reverseArray(state, target) {
    return state[target].reverse();
  },

  // Doc Count
  updateLocalDocCount (state, count) {
    return state.sumLocalDocs = count
  },
  updateRemoteDocCount (state, count) {
    return state.sumRemoteDocs = count
  },

  // Update Store from pouchdb.js Plugin
  stateUpdate (state, target) {
    if (target.t === 'orga') {
      Vue.set(state, target.t, target.data[0]);
    } else {
      Vue.set(state, target.t, target.data);
    }
  },

  dbCountUpdate (state, target) {
    return state[`${target.t}Count`] = target.count;
  },
  dbRemoteCountUpdate (state, target) {
    return state[`${target.t}RemoteCount`] = target.remoteCount;
  },

  // special FetchReady
  initFetchReadyMenuShown (state) {
    return state.menuHidden = true
  },
  fetchReadyAll(state) {
    console.log('All data in store commited!');
    return state.fetchReadyAll = true;
  },

  // APPS
  // Bill Split
  addExpense(state, { splitIndex, expense }) {
    state.billsplit[splitIndex].expensesList.push(expense);
  },
  removeExpense(state, { splitIndex, eIndex }) {
    state.billsplit[splitIndex].expensesList.splice(eIndex, 1);
  }
}
