import Vue from 'vue'
import socket from '~/plugins/socket.io.js'

Vue.prototype.$addUser = async (fullUser) => {
  console.log(` ######## [ Client Usermanagement ] ########  Register User "${fullUser.user.username}"`);
  return await new Promise((resolve, reject) => {
    socket.emit(`register`, fullUser, (err, result) => {
      console.log('err', err);
      if (err) return reject(err);
      return resolve(result);
    });
  });
}

Vue.prototype.$newPassword = async (user, password) => {
  console.log(` ######## [ Client Usermanagement ] ########  Set New Password for User "${user.username}"`);
  return await new Promise((resolve, reject) => {
    socket.emit(`newpassword`, user, password, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
}

Vue.prototype.$checkPassword = async (user, password) => {
  return await new Promise((resolve, reject) => {
    socket.emit('checkpassword', user, password, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
}
