import _ from 'lodash';

import config from '../modules/config';
import {storage, request} from '../modules';
import {
  INTEGRATIONS_SLACK_INFO,
  INTEGRATIONS_SLACK_ACCESS,
  INTEGRATIONS_SLACK_CHANNELS,
  INTEGRATIONS_SLACK_TEST,
  INTEGRATIONS_EMAIL_TEST,
  INTEGRATIONS_PAGERDUTY_INFO,
  INTEGRATIONS_PAGERDUTY_ACCESS
} from './constants';

export function getSlackChannels() {
  return (dispatch, state) => {
    dispatch({
      type: INTEGRATIONS_SLACK_CHANNELS,
      payload: new Promise((resolve, reject) => {
        return request
        .get(`${config.services.api}/services/slack/channels`)
        .set('Authorization', state().user.get('auth'))
        .then((res) => {
          resolve(_.get(res.body, 'channels') || []);
          /*eslint-disable no-use-before-define*/
          // getSlackInfo()(dispatch, state);
          /*eslint-enable no-use-before-define*/
        }, reject);
      })
    });
  };
}

export function getSlackInfo() {
  return (dispatch, state) => {
    dispatch({
      type: INTEGRATIONS_SLACK_INFO,
      payload: new Promise((resolve, reject) => {
        return request
        .get(`${config.services.api}/services/slack`)
        .set('Authorization', state().user.get('auth'))
        .then((res) => {
          resolve(res.body);
          // getSlackChannels()(dispatch, state);
        }, reject);
      })
    });
  };
}

export function slackAccess(query) {
  return (dispatch, state) => {
    dispatch({
      type: INTEGRATIONS_SLACK_ACCESS,
      payload: new Promise((resolve, reject) => {
        return request
        .post(`${config.services.api}/services/slack`)
        .set('Authorization', state().user.get('auth'))
        .send(query)
        .then((res) => {
          resolve(res.body);
          getSlackInfo()(dispatch, state);
          storage.set('shouldGetSlackChannels', true);
        }, reject);
      })
    });
  };
}

export function getPagerdutyInfo() {
  return (dispatch, state) => {
    dispatch({
      type: INTEGRATIONS_PAGERDUTY_INFO,
      payload: new Promise((resolve, reject) => {
        return request
        .get(`${config.services.hugs}/services/pagerduty`)
        .set('Authorization', state().user.get('auth'))
        .then((res) => {
          resolve(res.body);
        }, reject);
      })
    });
  };
}

export function pagerdutyAccess(query) {
  return (dispatch, state) => {
    dispatch({
      type: INTEGRATIONS_PAGERDUTY_ACCESS,
      payload: new Promise((resolve, reject) => {
         console.log(query);
         return request
         .post(`${config.services.hugs}/services/pagerduty`)
         .set('Authorization', state().user.get('auth'))
         .send(query)
         .then((res) => {
           resolve(res.body);
           getPagerdutyInfo()(dispatch, state);
         }, reject);
      })
    });
  };
}

export function testNotification(notif = {}) {
  let type = INTEGRATIONS_EMAIL_TEST;
  switch (notif.type){
  case 'slack_bot':
    type = INTEGRATIONS_SLACK_TEST;
    break;
  default:
    break;
  }
  const path = notif.type === 'slack_bot' ? 'slack' : notif.type;
  return (dispatch, state) => {
    dispatch({
      type,
      payload: new Promise((resolve, reject) => {
        return request
        .post(`${config.services.api}/services/${path}/test`)
        .set('Authorization', state().user.get('auth'))
        .send({
          notifications: [notif]
        })
        .then(() => {
          resolve(notif);
        }, reject);
      })
    });
  };
}

export function emailTest(notif = {type: undefined, value: undefined}) {
  return (dispatch, state) => {
    dispatch({
      type: INTEGRATIONS_EMAIL_TEST,
      payload: new Promise((resolve, reject) => {
        return request
        .post(`${config.services.api}/services/email/test`)
        .set('Authorization', state().user.get('auth'))
        .send(notif)
        .then((res) => {
          resolve(res.body);
        }, reject);
      })
    });
  };
}
