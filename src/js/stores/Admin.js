import Flux from '../modules/flux';
import Immutable, {List} from 'immutable';
import _ from 'lodash';

let _signups = new List();

const statics = {
  getSignupsSuccess(data){
    _signups = Immutable.fromJS(data);
  },
  _statuses: {
    adminActivateSignup: null
  }
};

const _public = {
  getSignups(){
    return _signups;
  }
};

const statusFunctions = Flux.statics.generateStatusFunctions(statics);

const Store = Flux.createStore(
  _.assign({}, _public, statusFunctions),
  function handlePayload(payload){
    switch (payload.actionType) {
    case 'ADMIN_GET_SIGNUPS_SUCCESS':
      statics.getSignupsSuccess(payload.data);
      Store.emitChange();
      break;
    case 'ADMIN_ACTIVATE_SIGNUP_SUCCESS':
          // _statuses.adminActivateSignup = null;
          // Store.emitChange();
      break;
    default:
      break;
    }
    const statusData = Flux.statics.statusProcessor(payload, statics, Store);
    statics._statuses = statusData.statuses;
    if (statusData.haveChanged){
      Store.emitChange();
    }
  }
);

export default Store;