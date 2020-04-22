const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Generate a random string of given length
const genRandomString = function(length = 15) {
  return crypto.randomBytes(Math.ceil(length/2)).toString('hex').slice(0,length);
};

// Recursively delete directory
let rimraf = function (dir_path) {
  if (fs.existsSync(dir_path)) {
    fs.readdirSync(dir_path).forEach(function(entry) {
      var entry_path = path.join(dir_path, entry);
      if (fs.lstatSync(entry_path).isDirectory()) {
        rimraf(entry_path);
      } else {
        fs.unlinkSync(entry_path);
      }
    });
    fs.rmdirSync(dir_path);
  }
};

// Pause execution for any amount of time in ms
let stall = async function(stallTime = 200) {
  await new Promise(resolve => setTimeout(resolve, stallTime));
};

module.exports = { genRandomString, rimraf, stall };
