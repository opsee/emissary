import config from '../modules/config';
import Flux from '../modules/flux';
import _ from 'lodash';
import moment from 'moment';
import Immutable, {Record, List, Map} from 'immutable';

let _signups = new List();

var Check = Record({
  name:null,
  info:null,
  id:null,
  method:null,
  path:null,
  port:null,
  meta:List(),
  group:null,
  headers:List(),
  assertions:List(),
  interval:null,
  message:null,
  notifications:List(),
  instances:List()
});

const statics = {
  getSignupsSuccess(data){
    _signups = Immutable.fromJS(data)
  }
}

let _statuses = {
  adminActivateSignup:null
}

const Store = Flux.createStore(
  {
    getSignups(){
      return _signups;
    },
    getActivateSignupStatus(){
      return _statuses.adminActivateSignup;
    }
  }, function(payload){
    switch(payload.actionType) {
      case 'ADMIN_GET_SIGNUPS_SUCCESS':
        statics.getSignupsSuccess(payload.data);
        Store.emitChange();
      break;
    }
    const newStatuses = Flux.statics.statusProcessor(payload, _statuses);
    if(!_.isEqual(_statuses, newStatuses)){
      _statuses = newStatuses;
      Store.emitChange();
    }
  }
)

export default Store;