const pkg = require('../../package');
const config = require('../fractools.config');
const secret = require('../serverSecret');

module.exports = (app, io) => {

  // Authentification Middleware
  io.use(function(socket, next) {
    if (socket.handshake.query.socketAuthToken === secret.socketAuthToken) {
      console.dir(' ######## [ Server Socket ] ######## Authorized Frontend connected! ');
      return next();
    }
    next(new Error('No valid Token!'));
  });

  // Connected Clients List
  let clients = [];

  // Socket for Client to connect with Node
  io.on('connection', (socket) => {
    console.dir(` ######## [ Server Socket ] ######## New Client "${socket.id}" connected! `);

    socket.on('clients', function (callback) {
      console.dir(` ######## [ Server Socket ] ######## Fetch Clients `);
      callback(clients);
    });

    // Socket for Client to disconnect
    socket.on('disconnect', function(){
      console.dir(` ######## [ Server Socket ] ######## Client "${socket.id}" disconnected! `);

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
