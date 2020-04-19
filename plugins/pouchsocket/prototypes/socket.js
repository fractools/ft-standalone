import Vue from 'vue'
import socket from '~/plugins/socket.io.js'

Vue.prototype.$socket = function (database, documents) {
  socket.on(`new-document`, (obj) => {
    console.log(` ######## [ Client Socket ] ########  Listen to new Data`);
    this.documents.push(obj)
  })

  socket.on(`updated-documents`, (obj) => {
    console.log(` ######## [ Client Socket ] ########  Listen to updated Data`);
    let l = [];
    l.push(obj); // TODO trixed
    const docs = this.documents.map(obj => l.find(o => o._id === obj._id) || obj);
    this.documents = docs;
  })

  socket.on(`removed-document`, (obj) => {
    console.log(` ######## [ Client Socket ] ########  Listen to removed Data`);
    const docs = this.documents.filter(v => v._id != obj._id);
    this.documents = docs;
  })
}

// Look for other Clients conected to Node
Vue.prototype.$getClients = async function () {
  console.log(` ######## [ Client Socket ] ########  Fetch Clients`);
  let clients = await new Promise(resolve => socket.emit('clients', resolve));
  return clients;
}

// Register own client
Vue.prototype.$pushClient = async function (username) {
  console.log(` ######## [ Client Socket ] ########  Push Client`);
  let client = { id: socket.id, user: username };
  socket.emit('client', client);
}


// Listen to Client Network
Vue.prototype.$clients = function (clients) {
  socket.on(`new-client`, (client) => {
    console.log(` ######## [ Client Socket ] ########  New Client detected ${client}`);
    this.clients.push(client);
  })
  socket.on(`disconnected-client`, (client) => {
    console.log(` ######## [ Client Socket ] ########  Client ${client} disconnected`);
    const clients = this.clients.filter(c => c != client);
    this.clients = clients;
  })
}
