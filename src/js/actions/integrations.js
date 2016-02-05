import _ from 'lodash';

import config from '../modules/config';
import {storage, request} from '../modules';
import {
  INTEGRATIONS_SLACK_INFO,
  INTEGRATIONS_SLACK_ACCESS,
  INTEGRATIONS_SLACK_CHANNELS
} from './constants';

export function getSlackChannels() {
  return (dispatch, state) => {
    dispatch({
      type: INTEGRATIONS_SLACK_CHANNELS,
      payload: new Promise((resolve, reject) => {
        return request
        .get(`${config.api}/services/slack/channels`)
        .set('Authorization', state().user.get('auth'))
        .then((res) => {
          resolve(_.get(res.body, 'channels') || []);
          getSlackInfo()(dispatch, state);
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
        .get(`${config.api}/services/slack`)
        .set('Authorization', state().user.get('auth'))
        .then((res) => {
          resolve(res.body);
          getSlackChannels()(dispatch, state);
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
        .post(`${config.api}/services/slack`)
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