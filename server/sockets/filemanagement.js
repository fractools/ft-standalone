const socketStream = require('socket.io-stream'),
      logger = require('../lib/logger'),
      fs = require('fs'),
      disk = require('diskusage'),
      config = require('../fractools.config'),
      uploadPath = config.uploadPath;

module.exports = (socket, clients) => {

  // Upload File
  socketStream(socket).on('fileupload', (stream, data) => {
    console.dir(` ######## [ Server Fileserver ] ######## Upload File `);
    let filename = data.name
        destination = global.__basedir + uploadPath;
    // Check commited Path
    if (data.path) {
      destination = destination + data.path + '/';
      // Check if Path exists
      if (!fs.existsSync(destination)){
        fs.mkdirSync(destination);
      };
    };
    // Write Data via Stream to Path
    stream.pipe(fs.createWriteStream(destination + filename)); // TODO Add Option 'Replace File'
  });

  // Remove File
  socket.on('removeFile', (path, filename, username, fn) => {
    let dest = global.__basedir + uploadPath,
        socketid = socket.id,
        client = { user: username, id: socketid };

    if (path) {
      dest = dest + path + '/';
    };

    fs.unlink(`${dest + filename}`, (err) => {
      if (err) return fn(err, null) && logger.createLog(null, 'Fileserver', 'error', `File "${filename}" not deleted in "${dest}"`, client);
      fn(null, 'Deleted');
      logger.createLog(null, 'Fileserver', 'info', `File "${filename}" deleted in ${dest}`, client);
    });
  });

  // Check Diskspace
  socket.on('checkdisk', (fn) => {
    disk.check('/', (err, info) => {
      if (err) {
        fn(err, null);
      } else {
        function toGB(x) { return (x / (1024 * 1024 * 1024)).toFixed(1); };
        let percentAvailable = ((info.available / info.total) * 100);
        fn(null, {
          freeGB: toGB(info.available),
          freePercent: percentAvailable,
          total: toGB(info.total)
        });
      };
    });
  });

  console.dir(` ######## [ Server Engine ] ######## Fileserver Initialized `);
};
