import {push} from 'redux-router';
import {createAction} from 'redux-actions';
import config from '../modules/config';
import request from '../modules/request';
import _ from 'lodash';
import * as analytics from './analytics';
import * as onboard from './onboard';
import {
  USER_SIGNUP_CREATE,
  USER_LOGIN,
  USER_LOGOUT,
  USER_REFRESH,
  USER_EDIT,
  USER_SET_PASSWORD,
  USER_GET_DATA,
  USER_PUT_DATA,
  USER_SEND_RESET_EMAIL,
  USER_SEND_VERIFICATION_EMAIL,
  USER_APPLY,
  USER_SET_LOGIN_DATA,
  USER_VERIFY_EMAIL,
  ENV_GET_BASTIONS
} from './constants';
import storage from '../modules/storage';
import * as team from './team';
import * as app from './app';

export function signupCreate(data, redirect) {
  return (dispatch, state) => {
    const params = _.pick(data, ['name', 'referrer', 'email', 'password']);
    dispatch({
      type: USER_SIGNUP_CREATE,
      payload: new Promise((resolve, reject) => {
        return request
        .post(`${config.services.auth}/signups/activate`)
        .send(params)
        .then(res => {
          const user = res.body;
          analytics.trackEvent('Onboard', 'signup', data)(dispatch, state);
          resolve(user);
          if (redirect) {
            setTimeout(() => { //TODO remove timeout somehow
              dispatch(push(redirect));
            }, 100);
          }
        }, err => {
          let msg = _.get(err, 'response.body.message');
          const r = msg ? new Error(msg) : err;
          reject(r);
        });
      })
    });
  };
}

export function login(data) {
  return (dispatch, state) => {
    dispatch({
      type: USER_LOGIN,
      payload: new Promise((resolve, reject) => {
        request
        .post(`${config.services.auth}/authenticate/password`)
        .send(data)
        .then((res) => {
          const user = res.body.user;
          analytics.trackEvent('User', 'login', null, user)(dispatch, state);

          request
          .get(`${config.services.api}/vpcs/bastions`)
          .set('Authorization', `Bearer ${res.body.token}`)
          .then(bastionRes => {
            dispatch({
              type: ENV_GET_BASTIONS,
              payload: _.get(bastionRes, 'body.bastions') || []
            });
            resolve(res.body);
            //TODO fix this somehow
            setTimeout(() => {
              team.getTeam()(dispatch, state);
            }, 10);
            setTimeout(() => {
              const string = state().router.location.query.redirect || '/';
              dispatch(push(string));
              /*eslint-disable no-use-before-define*/
              getData()(dispatch, state);
              /*eslint-enable no-use-before-define*/
            }, 100);
          }, reject);
        }, reject);
      })
    });
  };
}

export function setPassword(data) {
  return (dispatch, state) => {
    dispatch({
      type: USER_SET_PASSWORD,
      payload: new Promise((resolve, reject) => {
        return request
        .post(`${config.services.auth}/signups/${data.id}/claim`)
        .send(_.defaults(data, {
          invite: true
        }))
        .then((res) => {
          resolve(res.body);
          analytics.updateUser(res.body.user)(dispatch, state);
        }, reject);
      })
    });
  };
}

export function verifyEmail(data) {
  return (dispatch, state) => {
    const params = { token: data.verificationToken };
    dispatch({
      type: USER_VERIFY_EMAIL,
      payload: new Promise((resolve, reject) => {
        return request
        .post(`${config.services.auth}/users/${data.id}/verify`)
        .set('Authorization', state().user.get('auth'))
        .send(params)
        .then((res) => {
          analytics.trackEvent('User', 'verified-email', null, res.body.user)(dispatch, state);
          resolve(res.body);
          setTimeout(() => {
            dispatch(push('/profile?verified=true'));
          }, 40);
        }, reject);
      })
    });
  };
}

export function sendVerificationEmail(data) {
  return (dispatch, state) => {
    dispatch({
      type: USER_SEND_VERIFICATION_EMAIL,
      payload: new Promise((resolve, reject) => {
        return request
        .post(`${config.services.auth}/users/${data.id}/resend-verification`)
        .set('Authorization', state().user.get('auth'))
        .then((res) => {
          analytics.trackEvent('User', 'resend-verification-email')(dispatch, state);
          resolve(res.body);
        }, reject);
      })
    });
  };
}

export function logout(){
  return (dispatch, state) => {
    ['user', 'team', 'shouldGetSlackChannels', 'shouldSyncPagerduty']
    .map(str => storage.remove(str));
    analytics.trackEvent('User', 'logout')(dispatch, state);
    dispatch({
      type: USER_LOGOUT
    });
    setTimeout(() => {
      dispatch(push('/login'));
    }, 30);
  };
}

export function refresh() {
  return (dispatch, state) => {
    //logged out
    if (!state().user.get('auth')){
      return false;
    }
    return dispatch({
      type: USER_REFRESH,
      payload: new Promise((resolve, reject) => {
        request
        .put(`${config.services.auth}/authenticate/refresh`)
        .set('Authorization', state().user.get('auth'))
        .timeout(7000)
        .then((res) => {
          // Re-initiailize the analytics user, in case we have updated user data
          analytics.initialize(_.get(res.body, 'user'))(dispatch, state);
          resolve(res.body);
        }, (err) => {
          const redirect = state().router.location.pathname;
          let string = redirect ? '/login' : `/login?redirect=${redirect}`;
          storage.remove('user');
          dispatch(push(string));
          reject(err);
        });
      })
    });
  };
}

export const userApply = createAction(USER_APPLY);

export function edit(data, redirect) {
  return (dispatch, state) => {
    dispatch({
      type: USER_EDIT,
      payload: new Promise((resolve, reject) => {
        request
        .put(`${config.services.auth}/users/${data.id}`)
        .set('Authorization', state().user.get('auth'))
        .send(_.omit(data, ['notifications']))
        .then((res) => {
          resolve(res.body);
          const user = _.get(res, 'body.user');
          if (user){
            analytics.updateUser(user)(dispatch, state);
          }
          if (data.notifications && data.notifications.length){
            onboard.setDefaultNotifications(data.notifications)(dispatch, state);
          }
          if (data.subscription_plan){
            team.edit(data, null)(dispatch, state);
          }
          if (redirect) {
            setTimeout(() => {
              dispatch(push(redirect));
            }, 100);
          }
        }, reject);
      })
    });
  };
}

export function getData(){
  return (dispatch, state) => {
    dispatch({
      type: USER_GET_DATA,
      payload: new Promise((resolve, reject) => {
        request
        .get(`${config.services.auth}/users/${state().user.get('id')}/data`)
        .set('Authorization', state().user.get('auth'))
        .then(res => {
          resolve(res.body);
          const scheme = _.chain(res.body).get('scheme').thru(a => Array.isArray(a) ? a : []).last().get('data').value();
          if (scheme){
            app.setScheme(scheme, false, false)(dispatch, state);
          }
        }, reject);
      })
    });
  };
}

export function putData(key, data, reset){
  return (dispatch, state) => {
    dispatch({
      type: USER_PUT_DATA,
      payload: new Promise((resolve, reject) => {
        request
        .get(`${config.services.auth}/users/${state().user.get('id')}/data`)
        .set('Authorization', state().user.get('auth'))
        .then(res => {
          let user = res.body;
          let history = user[key];
          let index;
          if (history && Array.isArray(history) && history.length){
            index = history.length - 1;
          } else {
            index = 0;
            user[key] = [];
          }
          let record = user[key][index];
          if (record && record.revision !== process.env.REVISION){
            index++;
          }
          user[key][index] = {
            revision: process.env.REVISION,
            data: data
          };
          if (reset){
            user[key] = false;
          }
          return request
          .put(`${config.services.auth}/users/${state().user.get('id')}/data`)
          .set('Authorization', state().user.get('auth'))
          .send(user)
          .then(res2 => resolve(res2.body), reject);
        }, reject);
      })
    });
  };
}

export function sendResetEmail(data) {
  return (dispatch) => {
    dispatch({
      type: USER_SEND_RESET_EMAIL,
      payload: new Promise((resolve, reject) => {
        request
        .post(`${config.services.auth}/authenticate/token`)
        .send(data)
        .then(res => resolve(res.body), reject);
      })
    });
  };
}

export function setLoginData(data){
  return (dispatch) => {
    dispatch({
      type: USER_SET_LOGIN_DATA,
      payload: data
    });
  };
}