import config from '../modules/config';
import request from '../modules/request';
import {
  INTEGRATIONS_SLACK_ACCESS
} from './constants';

export function slackAccess(code) {
  return (dispatch) => {
    dispatch({
      type: INTEGRATIONS_SLACK_ACCESS,
      payload: new Promise((resolve, reject) => {
        request
        .get(`${config.api}/oauth/slack`)
        .query({
          code
        })
        .then((res) => {
          resolve(res.body);
        }, reject);
      })
    });
  };
}