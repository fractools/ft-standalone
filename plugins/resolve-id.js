import Vue from 'vue'
import Vuex from 'vuex'
import PouchDB from 'pouchdb'

export default ({ app, store }, inject) => {

  inject('resolveDisplaynameFromUsername', (username) => {
    let userdata = store.state.userdata;
    let displayname = '';
    for (let i = 0; i < userdata.length; i++) {
      if (userdata[i]._id === username) {
        if (userdata[i].displayname) {
          displayname = userdata[i].displayname;
        } else {
          displayname = userdata[i]._id.charAt(0).toUpperCase() + userdata[i]._id.slice(1);
        }
        return displayname;
      }
    }
    return displayname;
  });

}
