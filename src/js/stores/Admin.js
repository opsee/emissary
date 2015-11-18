import Flux from '../modules/flux';
import Immutable, {List} from 'immutable';
import _ from 'lodash';

const _data = {
  signups: new List(),
  users: new List()
};

const statics = {
  getSignupsSuccess(data){
    _data.signups = Immutable.fromJS(data);
  },
  getUsersSuccess(data){
    _data.users = Immutable.fromJS(data);
  },
  _statuses: {
    adminActivateSignup: null,
    adminGetUsers: null
  }
};

const _public = {
  getSignups(){
    return _data.signups;
  },
  getUsers(){
    return _data.users;
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
    case 'ADMIN_GET_USERS_SUCCESS':
      statics.getUsersSuccess(payload.data);
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