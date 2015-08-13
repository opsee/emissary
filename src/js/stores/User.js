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

let _status = {
  pending:false,
  success:false,
  error:false
}

const statics = {
  setUser(data){
    _user = Immutable.fromJS(data);
    storage.set('user',_user.toJS());
  },
  loginSuccess(data){
    _status = {
      pending:false,
      success:true,
      error:false
    }
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
        _status = {
          pending:true,
          success:false,
          error:false
        }
        UserStore.emitChange();
      break;
      case 'USER_LOGIN_SUCCESS':
        statics.loginSuccess(payload.data);
        UserStore.emitChange();
      break;
      case 'USER_LOGIN_ERROR':
        _status = {
          pending:false,
          success:false,
          error:true
        }
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
