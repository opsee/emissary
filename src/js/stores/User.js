import config from '../modules/config';
import Flux from '../modules/flux';
import storage from '../modules/storage';
import Immutable, {Record, List, Map} from 'immutable';
import _ from 'lodash';

var User = Record({
  name:null,
  email:null,
  id:null,
  token:null
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
  user:initialUser || new User()
}

let _statuses = {
  userLogin:null,
  userSendResetEmail:null,
  userEdit:null,
  userGetUser:null
};

const _public = {
  getAuth(){
    return _data.user.get('token') ? `Bearer ${_data.user.get('token')}` : null;
  },
  hasUser(){
    return !!(_data.user.get('token') && _data.user.get('email'));
  },
  getUser(){
    return _data.user;
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
      case 'ONBOARD_SET_PASSWORD_SUCCESS':
      case 'USER_SET':
      case 'USER_LOGIN_SUCCESS':
      case 'USER_EDIT_SUCCESS':
        statics.setUser(payload.data);
        Store.emitChange();  
      break;
      case 'USER_LOG_OUT':
        statics.logout();
        Store.emitChange();  
      break;
    }
    _statuses = Flux.statics.statusProcessor(payload, _statuses, Store);
  }
);

export default Store;
