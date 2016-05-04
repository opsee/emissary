import _ from 'lodash';

import config from '../modules/config';
import {storage, request} from '../modules';
import * as analytics from './analytics';
import {
  INTEGRATIONS_SLACK_INFO,
  INTEGRATIONS_SLACK_ACCESS,
  INTEGRATIONS_SLACK_CHANNELS,
  INTEGRATIONS_SLACK_TEST,
  INTEGRATIONS_EMAIL_TEST,
  INTEGRATIONS_PAGERDUTY_INFO,
  INTEGRATIONS_PAGERDUTY_ACCESS,
  INTEGRATIONS_PAGERDUTY_TEST
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
          analytics.trackEvent('Integrations', 'slack-added');
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
        .get(`${config.services.api}/services/pagerduty`)
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
        return request
        .post(`${config.services.api}/services/pagerduty`)
        .set('Authorization', state().user.get('auth'))
        .send(query)
        .then((res) => {
          resolve(res.body);
          const isEnabled = _.get(res, 'body.enabled');
          analytics.trackEvent('Integrations', isEnabled ? 'pagerduty-added' : 'pageduty-removed');
          getPagerdutyInfo()(dispatch, state);
          storage.set('shouldSyncPagerduty', isEnabled);
        }, reject);
      })
    });
  };
}

export function testNotification(notif = {}) {
  let type = INTEGRATIONS_EMAIL_TEST;
  let path = notif.type;
  switch (notif.type){
  case 'slack_bot':
    path = 'slack';
    type = INTEGRATIONS_SLACK_TEST;
    break;
  case 'pagerduty':
    type = INTEGRATIONS_PAGERDUTY_TEST;
    break;
  default:
    break;
  }

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