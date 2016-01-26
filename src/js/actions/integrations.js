import config from '../modules/config';
import request from '../modules/request';
import {
  INTEGRATIONS_SLACK_ACCESS,
  INTEGRATIONS_SLACK_CHANNELS
} from './constants';

// export function slackAccess(query) {
//   return (dispatch, state) => {
//     dispatch({
//       type: INTEGRATIONS_SLACK_ACCESS,
//       payload: new Promise((resolve, reject) => {
//         return request
//         .get(`${config.api}/services/slack/code`)
//         .set('Authorization', state().user.get('auth'))
//         .query(query)
//         .then((res) => {
//           resolve(res.body);
//         }, reject);
//       })
//     });
//   };
// }

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
        }, reject);
      })
    });
  };
}

export function slackChannels() {
  return (dispatch, state) => {
    dispatch({
      type: INTEGRATIONS_SLACK_CHANNELS,
      payload: new Promise((resolve, reject) => {
        return request
        .get(`${config.api}/services/slack/channels`)
        .set('Authorization', state().user.get('auth'))
        .then((res) => {
          resolve(res.body);
        }, reject);
      })
    });
  };
}