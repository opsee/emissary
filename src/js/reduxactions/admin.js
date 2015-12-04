import config from '../modules/config';
import request from '../modules/request';
import {
  ADMIN_GET_SIGNUPS,
  ADMIN_GET_USERS,
  ADMIN_ACTIVATE_SIGNUP
} from './constants';

export function getSignups() {
  return (dispatch, state) => {
    dispatch({
      type: ADMIN_GET_SIGNUPS,
      payload: new Promise((resolve, reject) => {
        request
        .get(`${config.authApi}/signups`)
        .set('Authorization', state().user.get('auth'))
        .query({
          per_page: 1000
        })
        .then(res => resolve(res.body), reject);
      })
    });
  };
}

export function activateSignup(signup) {
  return (dispatch, state) => {
    dispatch({
      type: ADMIN_ACTIVATE_SIGNUP,
      payload: new Promise((resolve, reject) => {
        request
        .put(`${config.authApi}/signups/${signup.id}/activate`)
        .set('Authorization', state().user.get('auth'))
        .then(res => {
          resolve(res.body);
          getSignups()(dispatch, state);
        }, reject);
      })
    });
  };
}

export function getUsers() {
  return (dispatch, state) => {
    dispatch({
      type: ADMIN_GET_USERS,
      payload: new Promise((resolve) => {
        request
        .get(`${config.authApi}/users`)
        .set('Authorization', state().user.get('auth'))
        .query({
          per_page: 1000
        })
        .then(res => resolve(res.body));
      })
    });
  };
}