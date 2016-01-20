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

function makeUserObject(userData) {
  const user = userData.toJS ? userData.toJS() : userData;

  return {
    email: user.email,
    name: user.name,
    customer_id: user.customer_id,
    id: user.id,
    auth_token: user.token,
    intercom_hmac: user.intercom_hmac
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

export function updateUser(updatedUser) {
  return (dispatch, state) => {
    // The user in state has attributes that updatedUser does not have, since
    // the latter is only profile information. However, the profile information
    // in state().user could be stale, so we only use that for token & id.
    const user = state().user;

    const update = {
      id: user.id,
      email: updatedUser.email,
      name: updatedUser.name,
      token: user.token,
      custom_attributes: {
        customer_id: user.customer_id,
        admin: user.admin,
        admin_id: user.admin_id,
        verified: user.verified
      }
    };

    dispatch({
      type: ANALYTICS_USER_UPDATE,
      payload: request
        .post(`${ANALYTICS_API}/user`)
        .send({ user: update })
    });
  };
}