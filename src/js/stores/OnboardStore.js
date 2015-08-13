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

let _signupCreateStatus = {
  pending:false,
  success:false,
  error:false
}

function loginSuccess(data){
  _status = {
    pending:false,
    success:true,
    error:false
  }
  _user = data;
  storage.set('user',_user);
}

const UserStore = Flux.createStore(
  {
    getUser(){
      return _user;
    },
    getStatus(){
      return _status;
    },
    getSignupCreateStatus(){
      return _signupCreateStatus;
    },
  }, function(payload){
    switch(payload.actionType) {
      case 'SIGNUP_CREATE_PENDING':
        _status = {
          pending:true,
          success:false,
          error:false
        }
        UserStore.emitChange();
      break;
      case 'SIGNUP_CREATE_SUCCESS':
        loginSuccess(payload.data);
        UserStore.emitChange();
      break;
      case 'SIGNUP_CREATE_ERROR':
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
