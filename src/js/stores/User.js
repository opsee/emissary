import config from '../modules/config';
import Flux from '../modules/flux';
import storage from '../modules/storage';
import Immutable, {Record, List, Map} from 'immutable';
import _ from 'lodash';
import moment from 'moment';

var User = Record({
  name:null,
  email:null,
  id:null,
  token:null,
  loginDate:null
})

const statics = {
  setUser(data){
    if(data && data.user){
      data.user.token = data.token;
    }
    _data.user = Immutable.fromJS(data.user || data);
    storage.set('user',_data.user.toJS());
    Store.emitChange();
  },
  logout(){
   storage.remove('user');
   _data.user = new User();
   Store.emitChange();
  }
}

let initialUser = storage.get('user');
initialUser = initialUser ? new User(initialUser) : null;

let _data = {
  user:initialUser || new User(),
  userData:null
}

let _statuses = {
  userLogin:null,
  userSendResetEmail:null,
  userEdit:null,
  userGetUser:null,
  userPutUserData:null,
  userGetUserData:null
};

const _public = {
  getAuth(){
    const date = _data.user.get('loginDate');
    const momentDate = moment(date);
    const diff = moment().diff(momentDate, 'm');
    // 720 minutes == 12 hours
    const valid = !!(typeof diff == 'number' && diff < 720 && diff > -1);
    if(!date || !valid){
      return null;
    }
    return _data.user.get('token') ? `Bearer ${_data.user.get('token')}` : null;
  },
  hasUser(){
    return !!(_public.getAuth() && _data.user.get('email'));
  },
  getUser(){
    if(_data.user.get('email') == 'cliff@leaninto.it'){
      config.demo = true;
    }
    return _data.user;
  },
  getUserData(){
    return _data.userData;
  }
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
      case 'ONBOARD_SET_PASSWORD_SUCCESS':
      case 'USER_SET':
      case 'USER_LOGIN_SUCCESS':
      case 'USER_EDIT_SUCCESS':
        if(payload.actionType == 'USER_LOGIN_SUCCESS'){
          payload.data.user.loginDate = new Date();
        }
        statics.setUser(payload.data);
        Store.emitChange();  
      break;
      case 'USER_LOG_OUT':
        statics.logout();
        Store.emitChange();  
      break;
      case 'USER_PUT_USER_DATA_SUCCESS':
      case 'USER_GET_USER_DATA_SUCCESS':
        _data.userData = payload.data;
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
