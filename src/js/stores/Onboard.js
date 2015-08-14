import constants from '../constants';
import Flux from '../Flux';
import request from 'superagent';
import storage from '../storage';
import './User'

// data storage
let _user = storage.get('user') || {
  name:null,
  email:null,
  id:null,
  token:null
}

let _statuses = {
  signupCreate:null,
  setPassword:null
};

const Store = Flux.createStore(
  {
    getSignupCreateStatus(){
      return _statuses.signupCreate;
    },
    getSetPasswordStatus(){
      return _statuses.setPassword;
    }
  }, function(payload){
    switch(payload.actionType) {
      case 'SIGNUP_CREATE_SUCCESS':
        // loginSuccess(payload.data);
      break;
    }
    _statuses = Flux.statics.statusProcessor(payload, _statuses);
    Store.emitChange();
  }
)

export default Store;
