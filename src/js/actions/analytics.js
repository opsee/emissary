import _ from 'lodash';
import UUID from 'uuid-v4';

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
 * @returns {string} - an anonymous UUID for tracking unauthenticated users
 *    (similar in spirit to Google Analytics' _ga cookie)
 */
function getAnonymousUUID() {
  return localStorage.getItem('_opsee_uuid');
}

/**
 * @returns {object} - an object containing minimum viable user data
 *    required by Myst
 */
function makeUserObject(userData) {
  // Users taken from redux state are Immutable Records, but user updates
  // are objects -- cast 'em all to JavaScript
  const user = userData.toJS ? userData.toJS() : userData;

  // FIXME do we want to use anonymous UUID for authenticated users?
  return _.pick(user, ['email', 'name', 'customer_id', 'id']);
}

/**
 * @param {string} path - e.g., '/', '/login', '/search?foo=bar'
 * @param {string} title - e.g., 'Opsee', 'Login'. [Default: document.title]
 */
export function trackPageView(path, title) {
  return (dispatch, state) => {
    if (config.ghosting){
      return Promise.resolve();
    }

    // FIXME Legacy analytics -- remove when Myst is stable
    analytics.pageView(path, title);

    // Grab the visitor's UUID from local storage, if anonymous
    const uuid = getAnonymousUUID();
    const user = _.assign({}, makeUserObject(state().user), { uuid });
    const name = title || document.title;

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
export function trackEvent(category, action = '', data = {}, userData = null) {
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
    // in state().user could be stale, so we only use that for id.
    const update = _.assign({}, {user_id: state().user.get('id')}, updatedUser);

    dispatch({
      type: ANALYTICS_USER_UPDATE,
      payload: request
        .post(`${ANALYTICS_API}/user`)
        .send({ user: update })
    });
  };
}

export function initialize() {
  return (dispatch, state) => {
    const user = state().user;
    const isAuthenticated = user.get('token') && user.get('id');

    // If the user is authenticated, we can initialize them with their identity
    // TODO: update last_seen_at
    if (isAuthenticated) {
      const update = makeUserObject(user);
      dispatch({
        type: ANALYTICS_USER_UPDATE,
        payload: request
          .post(`${ANALYTICS_API}/user`)
          .send({ user: update })
      });
    } else {
      // Unauthenticated users are tracked with an anonymous, client-side UUID
      // in order to accurately capture repeat visits.
      if (!getAnonymousUUID()) {
        localStorage.setItem('_opsee_uuid', UUID());
      }
    }
  };
}