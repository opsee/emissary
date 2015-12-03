import storage from '../modules/storage';
import {Record} from 'immutable';
import _ from 'lodash';
import {handleActions} from 'redux-actions';
import moment from 'moment';
import config from '../modules/config';

const User = Record({
  name: null,
  email: null,
  id: null,
  token: null,
  loginDate: null,
  admin: false,
  admin_id: 0,
  intercom_hmac: null,
  auth: null,
  ghosting: false,
  customerId: undefined,
  data: {}
});

function getAuth(data){
  const date = data.loginDate;
  const momentDate = moment(date);
  const diff = moment().diff(momentDate, 'm');
  // 720 minutes == 12 hours
  let minutes = 720;
  // 15 minutes for ghosting
  if (data.admin_id > 0){
    minutes = 15;
  }
  const valid = !!(typeof diff === 'number' && diff < minutes && diff > -1);
  let auth;
  if (date && valid && data.token){
    auth = `Bearer ${data.token}`;
  }
  return auth;
}

let initial = new User();
const localUser = storage.get('user');
if (localUser && getAuth(localUser)){
  initial = new User(localUser);
}

function setUser(state, action){
  let obj = _.assign({},
    action.payload.user,
    {
      token: action.payload.token || state.token,
      loginDate: action.payload.loginDate || new Date(),
      intercom_hmac: action.payload.intercom_hmac || state.intercom_hmac
    }
  );
  obj.ghosting = obj.admin_id > 0 || config.ghosting;
  const auth = getAuth(obj);
  if (auth){
    obj = _.assign({}, obj, {auth});
    storage.set('user', obj);
    return new User(obj);
  }
  return state;
}

export default handleActions({
  USER_LOGIN: {
    next: setUser
  },
  USER_EDIT: {
    next: setUser
  },
  USER_SET_PASSWORD: {
    next: setUser
  },
  USER_LOGOUT: {
    next(){
      return new User();
    }
  },
  USER_REFRESH: {
    next(state, action){
      const data = _.assign({}, action.payload, {loginDate: new Date()});
      return setUser(state, {payload: data});
    },
    throw(){
      return new User();
    }
  },
  USER_GET_CUSTOMER: {
    next(state, action){
      return new User(_.assign({}, state.toJS(), action.payload));
    },
    throw(state){
      return state;
    }
  },
  USER_GET_DATA: {
    next(state, action){
      return new User(_.assign({}, state.toJS(), {data: action.payload}));
    },
    throw(state, action){
      if (config.env === 'production'){
        console.error(action);
      }
      return state;
    }
  }
}, initial);