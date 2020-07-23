import Vue from 'vue'
import moment from 'moment'
import pkg from '~/package'

const fileserver = `http://${pkg.backend}/uploads/`;

// resolve values that need to be stored in different format
// number to currency EURO
Vue.prototype.$resolveNumberToCurrency = (num) => {
  let val = (num/1).toFixed(2).replace('.', ',');
  val = val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${val}€`;
}
// date to GER date format
Vue.prototype.$resolveDateToGerFormat = (date) => {
  moment.locale('de');
  return moment(date).format('L');
}
// int to percent format
Vue.prototype.$resolveIntToPercentStr = (int) => {
  let val = Math.floor(int * 10000) / 100;
  return `${val}%`;
}

Vue.prototype.$resolveFileExtension = (str) => {
  let re = /(?:\.([^.]+))?$/;
  return re.exec(str)[1];
}

Vue.prototype.$resolveArrayWithUniqueItems = (arr) => {
  let uniqueArr = [...new Set(arr)];
  return uniqueArr;
}

// get fileserver IP
Vue.prototype.$resolveFileserverAddress = (fileData) => {
  let genLink = fileserver + fileData.path + '/' + fileData.filename;
  return genLink;
}

Vue.prototype.$arrayToEnumeration = (arr) => {
  return [arr.slice(0, -1).join(', '), arr.slice(-1)[0]].join(arr.length < 2 ? '' : ' und ');
}
