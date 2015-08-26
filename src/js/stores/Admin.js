import config from '../config';
import Flux from '../Flux';
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

const Store = Flux.createStore(
  {
    getSignups(){
      return _signups;
    },
  }, function(payload){
    switch(payload.actionType) {
      case 'GET_SIGNUPS_SUCCESS':
      statics.getSignupsSuccess(payload.data);
      Store.emitChange();
      break;
    }
  }
)

export default Store;