import {pushState} from 'redux-router';
import config from '../modules/config';
import request from '../modules/request';
import _ from 'lodash';
import {
  GET_CHECK,
  GET_CHECKS,
  DELETE_CHECK
} from './constants';

export function getCheck(id){
  return (dispatch, state) => {
    dispatch({
      type: GET_CHECK,
      payload: new Promise((resolve, reject) => {
        const r1 = request
        .get(`${config.api}/checks/${id}`)
        .set('Authorization', state().user.get('auth'));

        const r2 = request
        .get(`${config.api}/notifications/${id}`)
        .set('Authorization', state().user.get('auth'));

        const r3 = request
        .get(`${config.api}/assertions/${id}`)
        .set('Authorization', state().user.get('auth'));

        Promise.all([r1, r2, r3]).then((values) => {
          const check = values[0].body;
          const {notifications} = values[1].body;
          const {assertions} = values[2].body;
          const obj = _.assign({}, check, {notifications, assertions});
          resolve(obj);
        }, reject);
      })
    });
  };
}

export function getChecks(redirect){
  return (dispatch, state) => {
    dispatch({
      type: GET_CHECKS,
      payload: new Promise((resolve, reject) => {
        return request
        .get(`${config.api}/checks`)
        .set('Authorization', state().user.get('auth'))
        .then(res => {
          resolve(_.get(res.body, 'checks'));
          if (redirect){
            setTimeout(() => {
              dispatch(pushState(null, '/start/thanks'));
            }, 100);
          }
        }, reject);
      })
    });
  };
}

export function deleteCheck(id){
  return (dispatch, state) => {
    dispatch({
      type: DELETE_CHECK,
      payload: new Promise((resolve, reject) => {
        return request
        .del(`${config.api}/checks/${id}`)
        .set('Authorization', state().user.get('auth'))
        .then(res => {
          resolve(res.body);
          getChecks(true)(dispatch, state);
        }, reject);
      })
    });
  };
}