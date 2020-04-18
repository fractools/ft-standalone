// Reference: https://ciphertrick.com/salt-hash-passwords-using-nodejs-crypto/
const crypto = require('crypto');

let genRandomString = function(length) {
  return crypto.randomBytes(Math.ceil(length/2)).toString('hex').slice(0,length);
};

let sha512 = function(password, salt){
  let hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  let value = hash.digest('hex');
  return {
    salt:salt,
    passwordHash:value
  };
};

// Register or set New Password
function saltHashPasswordRegister(userpassword) {
  let salt = genRandomString(16);
  let passwordData = sha512(userpassword, salt);
  return passwordData;
};

// Login or PasswordCheck for new Password
function saltHashPassword(userpassword, salt) {
  let passwordData = sha512(userpassword, salt);
  return passwordData;
};

// Check if Passwords match
async function matchPassword(db, delivered) {
  return await new Promise((resolve, reject) => {
    if (db === delivered) {
      return resolve('Password matches');
    } else {
      return reject('Old password does not match');
    };
  });
};

module.exports = {
  genRandomString,
  saltHashPasswordRegister,
  saltHashPassword,
  matchPassword,
  sha512
};
