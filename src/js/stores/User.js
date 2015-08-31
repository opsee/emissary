import config from '../modules/config';
import Flux from '../modules/flux';
import storage from '../modules/storage';
import Immutable, {Record, List, Map} from 'immutable';
import _ from 'lodash';
import GlobalActions from '../actions/Global';
import UserActions from '../actions/User';

var User = Record({
  name:null,
  email:null,
  id:null,
  token:null
})

let initialUser = storage.get('user');
initialUser = initialUser ? new User(initialUser) : null;
let _user = initialUser || new User();

const statics = {
  setUser(data){
    _user = Immutable.fromJS(data);
    storage.set('user',_user.toJS());
  },
  logout(){
   storage.remove('user');
   _user = new User();
  }
}

let _statuses = {
  userLogin:null,
  userSendResetEmail:null
};

const Store = Flux.createStore(
  {
    getUser(){
      return _user;
    },
    getUserLoginStatus(){
      return _statuses.userLogin;
    },
    getAuth(){
      return _user.get('token');
    },
    getUserSendResetEmailStatus(){
      return _statuses.userSendResetEmail;
    }
  }, function(payload){
    switch(payload.actionType) {
      case 'USER_LOGIN_SUCCESS':
        if(payload.data && payload.data.token){
          statics.setUser(payload.data);
          GlobalActions.globalSocketStart();
        }else{
          UserActions.userGetProfile(payload.data);
        }
      break;
      case 'USER_LOG_OUT':
        statics.logout();
      break;
    }
    _statuses = Flux.statics.statusProcessor(payload, _statuses);
    Store.emitChange();
  }
)

export default Store;
