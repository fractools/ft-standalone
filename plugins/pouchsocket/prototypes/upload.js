import Vue from 'vue'
import pkg from '~/package'
import socket from '~/plugins/socket.io.js'
import socketStream from 'socket.io-stream'

const fileserver = `http://${pkg.backend}/` // TODO Dynamic SSL

// General File Upload
Vue.prototype.$upload = async (files, path, username) => {
  console.log(` ######## [ Client Filemanager ] ########  Upload File into "${path}"`);
  return new Promise((resolve, reject) => {
    for (let file of files) {
      let stream = socketStream.createStream();
      socketStream(socket).emit('fileupload', stream, { name: file.name, path: path });
      socketStream.createBlobReadStream(file).pipe(stream);
    };
    resolve(true);
  });
};

// Remove uploaded File
Vue.prototype.$removeFile = async (filename, path, username) => {
  console.log(` ######## [ Client Filemanager ] ########  Remove File from "${path}"`);
  return new Promise((resolve, reject) => {
    socket.emit('removeFile', path, filename, username, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
}

// Check Diskspace
Vue.prototype.$checkDiskspace = async () => {
  console.log(` ######## [ Client Filemanager ] ########  Check Diskspace`);
  return new Promise((resolve, reject) => {
    socket.emit('checkdisk', (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
}

// Specific PDF Upload
Vue.prototype.$pdfUpload = async (file, destination) => {
  console.log(` ######## [ Client Filemanager ] ########  Upload PDF into "${destination}"`);
  // Initialize the form data
  let formData = new FormData(),
      dest = `pdf/${destination}`;
  // Add the form data we need to submit
  formData.append('file', file);
  formData.append('dest', dest);
  // TODO Filename?
  // Upload PDF into Fileserver
  try {
    let res = await axios.post(`${fileserver}upload`, formData);
  } catch (err) {
    console.log(err);
  }
}

// Get uploaded File
Vue.prototype.$getFile = async (filename, destination) => {
  console.log(` ######## [ Client Filemanager ] ########  Get File from "${destination}"`);
  // Initialize the FormData
  let formData = new FormData(),
      dest = `pdf/${destination}`;
  // Add the form data we need to submit
  formData.append('filename', filename);
  formData.append('dest', dest);
  // Get File from Fileserver
  try {
    let res = await axios.post(`${fileserver}file`, formData)
    return res;
  } catch (err) {
    console.log(err);
    // throw err;
  }
}

// Convert PDF into PNG
Vue.prototype.$pdf2png = async () => {
  console.log(` ######## [ Client Filemanager ] ########  Convert PDF-File to PNG-File`);
    try {
      let res = await axios.post(`${fileserver}pdf2png`)
    } catch (err) {
      console.log(err);
    }
}

Vue.prototype.$extractText = async () => {
  console.log(` ######## [ Client Filemanager ] ########  Convert PDF-File to PNG-File`);
  try {
    let res = await axios.post(`${fileserver}extracttext`)
  } catch (err) {
    console.log(err);
  }
}
