const logger = require('../lib/logger'),
      pkg = require('../../package');

module.exports = (app, io) => {

  // Connected Clients List
  let clients = [];

  // Socket for Client to connect with Node
  io.on('connection', (socket) => { // TODO Handshake
    console.dir(` ######## [ Server Socket ] ######## New Client "${socket.id}" connected!`);

    socket.on('clients', function (callback) {
      console.dir(` ######## [ Server Socket ] ######## Fetch Clients`);
      callback(clients);
    });

    // Socket for Client to disconnect
    socket.on('disconnect', function(){
      console.dir(` ######## [ Server Socket ] ######## Client "${socket.id}" disconnected!`);

      let recentClients = clients.filter(c => c.id != socket.id);
      clients = recentClients;
      socket.broadcast.emit(`new-client`, clients);
    });

    // Filemanagement
    require('./filemanagement')(socket, clients);
    // Documentmanagement
    require('./dbmanagement')(socket, clients);
    // Authentififcation
    require('./auth')(socket, io, clients);
    // NodeMailer
    require('./nodemailer')(socket, clients);
    // Usermanagement
    require('./usermanagement')(socket, clients);
    // Network Management
    require('./netmanagement')(socket, clients);
  });

  console.dir(' ######## [ Server Engine ] ######## Sockets Initialized ');
};
