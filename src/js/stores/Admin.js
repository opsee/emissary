import config from '../modules/config';
import Flux from '../modules/flux';
import _ from 'lodash';
import moment from 'moment';
import Immutable, {Record, List, Map} from 'immutable';

let _signups = new List();

const statics = {
  getSignupsSuccess(data){
    _signups = Immutable.fromJS(data);
  }
};

let _statuses = {
  adminActivateSignup:null
};

const Store = Flux.createStore(
  {
    getSignups(){
      return _signups;
    },
    getActivateSignupStatus(){
      return _statuses.adminActivateSignup;
    }
  }, function(payload){
  switch (payload.actionType) {
    case 'ADMIN_GET_SIGNUPS_SUCCESS':
      statics.getSignupsSuccess(payload.data);
      Store.emitChange();
      break;
    case 'ADMIN_ACTIVATE_SIGNUP_SUCCESS':
        // _statuses.adminActivateSignup = null;
        // Store.emitChange();
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