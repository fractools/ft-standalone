import socket from '~/plugins/socket.io.js';
import lists from './data.js';

export async function fillDefaultState() {

  if (true) { // TODO Clear out
    for (let list in lists) {

      let initDBfull = true;

      try {
        initDBfull = await new Promise((resolve, reject) => {
          socket.emit(`dbexists`, list, (err, result) => {
            if (err) return reject(err);
            return resolve(result);
          });
        });
      } catch (e) {
        console.log('dbExists', e);
      }

      for (let data of lists[list]) {
        if (initDBfull === false) {
          try {

            let res = await new Promise((resolve, reject) => {

              socket.emit(`send-document`, list, data, data._id, (err, result) => {
                if (err) return reject(err);
                return resolve(result);
              });

            });
          } catch (e) {
            console.log('send-document', e);
          }
        };

      }

    }
  }
};
