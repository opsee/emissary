import {pushState} from 'redux-router';
import config from '../modules/config';
import request from '../modules/request';
import _ from 'lodash';
import analytics from '../modules/analytics';
import {
  USER_LOGIN,
  USER_LOGOUT,
  USER_REFRESH,
  USER_EDIT,
  USER_START
} from './constants';
import storage from '../modules/storage';

export function login(data) {
  return (dispatch, state) => {
    dispatch({
      type: USER_LOGIN,
      payload: new Promise((resolve, reject) => {
        request
        .post(`${config.authApi}/authenticate/password`)
        .send(data)
        .then((res) => {
          resolve(res.body);
          //TODO fix this somehow
          setTimeout(() => {
            const string = state().router.location.query.redirect || '/';
            dispatch(pushState(null, string));
          }, 100);
        }, reject);
      })
    });
  };
}

export function start(){
  return (dispatch) => {
    const user = storage.get('user');
    dispatch({
      type: USER_START,
      payload: _.assign({
        user
      }, user)
    });
  };
}

export function logout(){
  return (dispatch) => {
    storage.remove('user');
    analytics.event('User', 'logout');
    dispatch({
      type: USER_LOGOUT
    });
    dispatch(pushState(null, '/login'));
  };
}

export function refresh() {
  return (dispatch, state) => {
    dispatch({
      type: USER_REFRESH,
      payload: new Promise((resolve, reject) => {
        //logged out
        if (!state().user.get('auth')){
          return reject();
        }
        request
        .put(`${config.authApi}/authenticate/refresh`)
        .set('Authorization', state().user.get('auth'))
        .timeout(7000)
        .then((res) => {
          resolve(res.body);
        }, (err) => {
          const redirect = state().router.location.pathname;
          let string = redirect ? '/login' : `/login?redirect=${redirect}`;
          storage.remove('user');
          dispatch(pushState(null, string));
          reject(err);
        });
      })
    });
  };
}

export function edit(data) {
  return (dispatch, state) => {
    dispatch({
      type: USER_EDIT,
      payload: new Promise((resolve, reject) => {
        request
        .put(`${config.authApi}/users/${data.id}`)
        .set('Authorization', state().user.get('auth'))
        .send(data)
        .then((res) => {
          resolve(res.body);
          //TODO fix this somehow
          setTimeout(() => {
            dispatch(pushState(null, '/profile'));
          }, 100);
        }, reject);
      })
    });
  };
}