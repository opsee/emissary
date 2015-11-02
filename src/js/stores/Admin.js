import Flux from '../modules/flux';
import Immutable, {List} from 'immutable';

let _signups = new List();

const statics = {
  getSignupsSuccess(data){
    _signups = Immutable.fromJS(data);
  },
  _statuses: {
    adminActivateSignup: null
  }
};

const Store = Flux.createStore(
  {
    getSignups(){
      return _signups;
    },
    getActivateSignupStatus(){
      return _statuses.adminActivateSignup;
    }
  }, function handlePayload(payload){
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