import analytics from '../modules/analytics';
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

/**
 * @returns {object} - an object containing minimum viable user data
 *    required by Myst
 */
function makeUserObject(userData) {
  // Users taken from redux state are Immutable Records, but user updates
  // are objects -- cast 'em all to JavaScript
  const user = userData.toJS ? userData.toJS() : userData;

  return {
    email: user.email,
    name: user.name,
    customer_id: user.customer_id,
    id: user.id,
    intercom_hmac: user.intercom_hmac
  };
}

/**
 * @param {string} path - e.g., '/', '/login', '/search?foo=bar'
 * @param {string} title - e.g., document.title
 */
export function trackPageView(path, title) {
  return (dispatch, state) => {
    if (config.ghosting){
      return Promise.resolve();
    }

    // FIXME Legacy analytics -- remove when Myst is stable
    analytics.pageView(path, title);

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

/**
 * @param {string} category - required; a broad category for the action
 *    e.g,. 'Login', 'Onboard'
 *
 * @param {string} action - optional; a finer-grained label for the event
 *    e.g., 'menu clicked', 'created check'
 *
 * @param {object} data - any additional metadata to be included with the action
 *
 * @param {object} userData - the user doing the event. In most cases, you'll
 *    want to rely on state().user and leave userData null; however, sometimes
 *    state().user is empty (e.g., with logins)
 */
export function trackEvent(category, action = '', data = {}, userData=null) {
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

    // FIXME Legacy analytics -- remove when Myst is stable
    analytics.event(category, action, data);

    const user = makeUserObject(userData || state().user);
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
    if (!updatedUser) {
      return Promise.resolve();
    }

    // FIXME Legacy analytics -- remove when Myst is stable
    window.Intercom('update', updatedUser);

    // The user in state has attributes that updatedUser does not have, since
    // the latter is only profile information. However, the profile information
    // in state().user could be stale, so we only use that for token & id.
    const user = state().user;

    // Construct the update by hand, vs. using makeUserObject in order to
    // correctly handle updated fields
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