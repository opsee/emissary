import {pushState} from 'redux-router';
import config from '../modules/config';
import request from '../modules/request';
import _ from 'lodash';
import analytics from '../modules/analytics';
import {
  ONBOARD_SIGNUP_CREATE,
  ONBOARD_SET_PASSWORD,
  ONBOARD_VPC_SCAN,
  ONBOARD_INSTALL
} from './constants';
import storage from '../modules/storage';

export function signupCreate(data) {
  return (dispatch, state) => {
    dispatch({
      type: ONBOARD_SIGNUP_CREATE,
      payload: new Promise((resolve, reject) => {
        return request
        .post(`${config.authApi}/signups`)
        .send(data)
        .then((res) => {
          resolve(res.body);
          //TODO remove timeout somehow
          setTimeout(() => {
            dispatch(pushState(null, '/start/thanks'))
          }, 100);
        }, reject);
      })
    });
  };
}