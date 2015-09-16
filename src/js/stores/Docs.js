import config from '../modules/config';
import Flux from '../modules/flux';
import storage from '../modules/storage';
import Immutable, {Record, List, Map} from 'immutable';
import _ from 'lodash';

const statics = {
}

let _data = {
  cloudFormationTemplate:null
}

let _statuses = {
  docsGetCloudFormationTemplate:null,
};

const _public = {
  getCloudFormationTemplate(){
    return _data.docsGetCloudFormationTemplate;
  },
}

let statusFunctions = {};
let keys = _.chain(_statuses).keys().map(k => {
  let arr = [k]
  arr.push('get'+_.startCase(k).split(' ').join('')+'Status');
  return arr;
}).forEach(a => {
  statusFunctions[a[1]] = function(){
    return _statuses[a[0]]
  }
}).value();

const Store = Flux.createStore(
  _.assign({}, _public, statusFunctions),
  function(payload){
    switch(payload.actionType) {
      case 'DOCS_GET_CLOUD_FORMATION_TEMPLATE_SUCCESS':
        _data.docsGetCloudFormationTemplate = payload.data;
      break;
    }
    const statusData = Flux.statics.statusProcessor(payload, _statuses, Store);
    _statuses = statusData.statuses;
    if(statusData.haveChanged){
      Store.emitChange();
    }
  }
);

export default Store;
