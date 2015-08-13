import Constants from '../Constants';
import Flux from '../Flux';
import request from 'superagent';
import storage from '../storage';
import Immutable, {Record, List, Map} from 'immutable';

var User = Record({
  name:null,
  email:null,
  id:null,
  token:null
})

let initialUser = storage.get('user');
initialUser = initialUser ? Immutable.fromJS(initialUser) : null;
let _user = initialUser || new User();

let _status = null;

const statics = {
  setUser(data){
    _user = Immutable.fromJS(data);
    storage.set('user',_user.toJS());
  },
  loginSuccess(data){
    statics.setUser(data);
  },
  logout(){
   storage.remove('user');
   _user = new User();
  }
}

const UserStore = Flux.createStore(
  {
    getUser(){
      return _user;
    },
    getStatus(){
      return _status;
    },
    getAuth(){
      return _user.get('token');
    }
  }, function(payload){
    switch(payload.actionType) {
      case 'USER_LOGIN_PENDING':
        _status = 'pending';
        UserStore.emitChange();
      break;
      case 'USER_LOGIN_SUCCESS':
        _status = 'success';
        statics.loginSuccess(payload.data);
        UserStore.emitChange();
      break;
      case 'USER_LOGIN_ERROR':
        _status = payload.data;
        UserStore.emitChange();
      break;
      case 'USER_LOG_OUT':
        statics.logout();
        UserStore.emitChange();
      break;
    }
  }
)

export default UserStore;
