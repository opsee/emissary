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
  userEdit:null
};

const Store = Flux.createStore(
  {
    getAuth(){
      return _data.user.get('token') ? `Bearer ${_data.user.get('token')}` : null;
    },
    hasUser(){
      return !!(_data.user.get('token') && _data.user.get('email'));
    },
    getUser(){
      return _data.user;
    },
    getUserLoginStatus(){
      return _statuses.userLogin;
    },
    getUserSendResetEmailStatus(){
      return _statuses.userSendResetEmail;
    },
    getUserEditStatus(){
      return _statuses.userEdit;
    }
  }, function(payload){
    switch(payload.actionType) {
      case 'ONBOARD_SET_PASSWORD_SUCCESS':
      case 'USER_SET':
      case 'USER_LOGIN_SUCCESS':
        statics.setUser(payload.data);
      break;
      case 'USER_LOG_OUT':
        statics.logout();
      break;
    }
    const newStatuses = Flux.statics.statusProcessor(payload, _statuses);
    if(!_.isEqual(_statuses, newStatuses)){
      _statuses = newStatuses;
      Store.emitChange();  
    }
  }
);

export default Store;
