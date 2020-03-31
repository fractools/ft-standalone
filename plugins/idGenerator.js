import Vue from 'vue'
import moment from 'moment'

// Generate IDs

Vue.prototype.$genid = function (database, user) {
  let id = moment(new Date()).add(2, 'hours').toJSON() + '-' + user + '-' + database + '-' + Math.random().toString(36).substr(2, 9);
  return id;
}

Vue.prototype.$genidUploadDir = function () {
  let id = Math.random().toString(36).substr(2, 9);
  return id;
}

Vue.prototype.$genRandomKey = function () {
  return Math.random().toString(36).substr(2, 9);
}

Vue.prototype.$genidDocCount = function (title, productionNumber) {
  // create an id from count and title
  let origId = '';
  let titleNew = title.split(' ').join('_');
  let paddedProdNumber = ("000" + productionNumber).substr(-3,3);
  let id = `${paddedProdNumber}_${titleNew}`;
  origId = id.toString();
  return origId;
}

Vue.prototype.$randomString = (length) => {
    return Math.random().toString(36).substring(length);
}
