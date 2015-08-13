import Constants from '../Constants';
import Flux from '../Flux';
import request from 'superagent';
import storage from '../storage';

// data storage
let _user = storage.get('user') || {
  name:null,
  email:null,
  id:null,
  token:null
}

let _status = {
  pending:false,
  success:false,
  error:false
}

let _signupCreateStatus;

const UserStore = Flux.createStore(
  {
    getSignupCreateStatus(){
      return _signupCreateStatus;
    },
  }, function(payload){
    switch(payload.actionType) {
      case 'USER_LOGIN_PENDING':
        _signupCreateStatus = 'pending';
        UserStore.emitChange();
      break;
      case 'USER_LOGIN_SUCCESS':
        _signupCreateStatus = 'success';
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
    }
  }
)

export default UserStore;
