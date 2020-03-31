// NuxtJS Auth Doc: https://nuxtjs.org/examples/auth-routes
import moment from 'moment'
import socket from '~/plugins/socket.io.js'


function createCookie(key, value, date) {
  let expiration = new Date(date).toUTCString();
  let cookie = escape(key) + '=' + escape(value) + ';' + 'expires=' + expiration + ';';
  document.cookie = cookie;
}

function readCookie(name, req) {
  let key = name + "=";
  let cookies = req.headers.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(key) === 0) {
      return cookie.substring(key.length, cookie.length);
    }
  }
  return null;
}

function deleteCookie(name) {
  let expiration = new Date(-1).toUTCString();
  let cookie = escape(name) + '=' + escape('') + ';' + 'expires=' + expiration + ';' + 'path=/;';
  document.cookie = cookie;
}

async function connectedSocket(socket) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(socket.connected)
    }, 1000);
  })
}

export default {
  // nuxtServerInit is called by Nuxt.js before server-rendering every page
  // Returns Data used in Node into Vuex Store
  async nuxtServerInit({ commit }, { req }) {
    let user;

    let connected = await connectedSocket(socket);

    if (connected) {
      commit('SOCKET_CONNECTIVITY', { val: true, addr: `${socket.io.opts.hostname}:${socket.io.opts.port}`  });

      if (req.headers.cookie) {

        let token = readCookie('token', req)

        if (token || token != 'undefined') {
          try {
            let data = await new Promise((resolve, reject) => {
              socket.emit('token', token, (err, res) => {
                if (err) return reject(err);
                return resolve(res);
              });
            })
            user = data;
          } catch (e) {
            // TODO Wrong Token handling
            console.log(e);
          }
        }
      }
      if (user) {
        commit('SET_USER', user)
      } else {
        try {
          await new Promise((resolve, reject) => {
            socket.emit('getalluser', (err, res) => {
              if (err) return reject(err);
              return resolve('ok');
            });
          });
        } catch (e) {
          if (e === 'No User exists') return commit('INIT_USER', true);
          console.log(e);
        };
      };
    } else {
      commit('SOCKET_CONNECTIVITY', { val: socket.connected, addr: `${socket.io.opts.hostname}:${socket.io.opts.port}`  });
    };
  },

  // Authentification API
  async login({ commit }, { username, password }) {
    try {
      const data = await new Promise((resolve, reject) => {
        socket.emit(`login`, { username, password }, (err, result) => {
          if (err) return reject(err);
          return resolve(result);
        });
      });
      commit('SET_USER', data);

      createCookie('token', data.token)

    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Nutzername oder Passwort ist falsch!')
      }
      console.log(error)
      throw error
    }
  },

  logout({ commit }) {
    commit('SET_USER', null);
    deleteCookie('token');
  },

  filterFilme({ commit }) {
    for (let i = 0, len = this.filme.length; i < len; i++) {
      if (moment(this.filme[i].cinemaRelease) > moment(this.altDate)) {
        this.filteredFilme.push(this.filme[i]);
      }
    }
  },

}
