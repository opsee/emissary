import config from '../modules/config';
import request from '../modules/request';
import URL from 'url';
import {
  ANALYTICS_EVENT,
  ANALYTICS_PAGEVIEW,
  ANALYTICS_USER_UPDATE
} from './constants';

const ANALYTICS_CONFIG = config.services.analytics;
const ANALYTICS_API = URL.format(ANALYTICS_CONFIG);

function makeUserObject(user) {
  return {
    email: user.get('email'),
    name: user.get('name')
  };
}

export function trackPageView(path, title) {
  return (dispatch, state) => {
    if (config.ghosting){
      return Promise.resolve();
    }

    const name = title || document.title;
    const user = makeUserObject(state().user);

    dispatch({
      type: ANALYTICS_PAGEVIEW,
      payload: request
        .post(`${ANALYTICS_API}/pageview`)
        .send({ path, name, user })
    });
  };
}

export function trackEvent(category, action = '', data = {}) {
  return (dispatch, state) => {
    if (config.ghosting){
      return Promise.resolve();
    }

    if (!category){
      if (config.env !== 'production'){
        console.warn('No category supplied to analytics event');
      }
      return Promise.resolve();
    }

    const user = makeUserObject(state().user);
    dispatch({
      type: ANALYTICS_EVENT,
      payload: request
        .post(`${ANALYTICS_API}/event`)
        .send({ category, action, user, data })
    });
  };
}

export function updateUser(userData) {
  return (dispatch) => {
    const user = {
      email: userData.email
    };

    dispatch({
      type: ANALYTICS_USER_UPDATE,
      payload: request
        .post(`${ANALYTICS_API}/user`)
        .send({ user })
    });
  };
}