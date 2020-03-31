const http = require('http'),
      pkg = require('./package'),
      { Nuxt, Builder } = require('nuxt'),
      express = require('express'),
      SocketIO = require('socket.io');

// Config Env
const PORT = process.env.PORT || pkg.config.nuxt.port;
const HOST = process.env.baseurl || pkg.config.nuxt.host;

const isProd = process.env.NODE_ENV === 'production'

// Define Root Path
global.__basedir = __dirname;

// Init App
const app = express();
const server = http.createServer(app);
const io = SocketIO(server);


// Instantiate Nuxt.js Options
const config = require('./nuxt.config.js');
config.dev = !isProd;

// Create a new Nuxt instance
const nuxt = new Nuxt(config);

async function nuxtReady () {
  // Make sure to wait for Nuxt to load modules before proceeding
  await nuxt.ready();
}

nuxtReady();

// Enable live build & reloading on dev
if (nuxt.options.dev) {
  new Builder(nuxt).build()
};

app.use(nuxt.render);

// Socket for Client to connect with Node
require('./server/sockets')(app, io);

// Init Server
server.listen(PORT, HOST);

console.dir(' ######## [ Server Engine ] ######## Server listening on: http://' + HOST + ':' + PORT)
