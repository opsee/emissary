import config from '../modules/config';
import Flux from '../modules/flux';
import _ from 'lodash';
import moment from 'moment';
import Immutable, {Record, List, Map} from 'immutable';
import GroupStore from './Group';

let _data = {
  instanceECC: new Instance(),
};

let _statuses = {
  getInstanceECC: null,
};

const statics = {
  getInstancePending(data){
    if (_data.instance.get('id') !== data){
      _data.instance = new Instance();
      Store.emitChange();
    }
  }
};

const _public = {
  getInstanceECC(){
    return _data.instanceECC;
  }
};

const statusFunctions = Flux.statics.generateStatusFunctions(_statuses);

const Store = Flux.createStore(
  _.assign({}, _public, statusFunctions),
  function handlePayload(payload){
    switch (payload.actionType) {
    case 'GET_INSTANCES_ECC_SUCCESS':
        // statics.getInstancesECCSuccess(payload.data);
      break;
    }
    const statusData = Flux.statics.statusProcessor(payload, _statuses, Store);
    _statuses = statusData.statuses;
    if (statusData.haveChanged){
      Store.emitChange();
    }
  }
);

export default Store;