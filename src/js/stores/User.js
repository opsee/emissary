import config from '../modules/config';
import Flux from '../modules/flux';
import storage from '../modules/storage';
import Immutable, {Record} from 'immutable';
import _ from 'lodash';
import moment from 'moment';

/* eslint-disable no-use-before-define */

const User = Record({
  name: null,
  email: null,
  id: null,
  token: null,
  loginDate: null,
  admin: false,
  admin_id: 0,
  loginRedirect: null
});

const statics = {
  setUser(data){
    if (data && data.user){
      data.user.token = data.token;
    }
    data.user.loginDate = data.user.loginDate || _data.user.get('loginDate');
    let obj = data.user || data;
    //don't overwrite properties that aren't coming from the api, like loginRedirect
    obj = _.assign({}, _data.user.toJS(), obj);
    _data.user = Immutable.fromJS(obj);
    storage.set('user', _data.user.toJS());
    Store.emitChange();
  },
  logout(){
    storage.remove('user');
    _data.user = new User();
    Store.emitChange();
  },
  getInitialUser(){
    let initialUser = storage.get('user');
    initialUser = initialUser ? new User(initialUser) : null;
    return initialUser || new User();
  },
  _statuses: {
    userLogin: null,
    userSendResetEmail: null,
    userEdit: null,
    userGetUser: null,
    userPutUserData: null,
    userGetUserData: null,
    userRefreshToken: null
  }
};

let _data = {
  user: statics.getInitialUser(),
  userData: null,
  refreshInterval: undefined
};

const _public = {
  getAuth(){
    const date = _data.user.get('loginDate');
    const momentDate = moment(date);
    const diff = moment().diff(momentDate, 'm');
    // 720 minutes == 12 hours
    let minutes = 720;
    // 15 minutes for ghosting
    if (_data.user.get('admin_id') > 0){
      minutes = 15;
    }
    const valid = !!(typeof diff === 'number' && diff < minutes && diff > -1);
    if (!date || !valid){
      return null;
    }
    return _data.user.get('token') ? `Bearer ${_data.user.get('token')}` : null;
  },
  hasUser(){
    return !!(_public.getAuth() && _data.user.get('email'));
  },
  getUser(){
    if (_data.user.get('email') === 'cliff@leaninto.it' && storage.get('demo') !== false){
      config.demo = true;
    }
    return _data.user;
  },
  getUserData(){
    return _data.userData;
  }
};

const statusFunctions = Flux.statics.generateStatusFunctions(statics);

const Store = Flux.createStore(
  _.assign({}, _public, statusFunctions),
  function handlePayload(payload){
    switch (payload.actionType) {
    case 'ONBOARD_SET_PASSWORD_SUCCESS':
    case 'USER_SET':
    case 'USER_LOGIN_SUCCESS':
    case 'USER_EDIT_SUCCESS':
      if (payload.actionType === 'USER_LOGIN_SUCCESS'){
        payload.data.user.loginDate = new Date();
      }
      statics.setUser(payload.data);
      Store.emitChange();
      break;
    case 'USER_REFRESH_TOKEN_SUCCESS':
      payload.data.user.loginDate = new Date();
      break;
    case 'USER_LOG_OUT':
    case 'USER_REFRESH_TOKEN_ERROR':
      config.intercom('shutdown');
      statics.logout();
      Store.emitChange();
      break;
    case 'USER_PUT_USER_DATA_SUCCESS':
    case 'USER_GET_USER_DATA_SUCCESS':
      _data.userData = payload.data;
      break;
    case 'USER_LOGIN_REDIRECT':
      _data.user = _data.user.set('loginRedirect', payload.data);
      break;
    default:
      break;
    }
    const statusData = Flux.statics.statusProcessor(payload, statics, Store);
    statics._statuses = statusData.statuses;
    if (statusData.haveChanged){
      Store.emitChange();
    }
  }
);

export default Store;
