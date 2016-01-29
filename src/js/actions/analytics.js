import _ from 'lodash';
import URL from 'url';

import analytics from '../modules/analytics';
import config from '../modules/config';
import ga from '../modules/ga';
import request from '../modules/request';
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

    // Only authenticated page views are tracked in Myst (for Intercom)
    // to update the 'last seen' time. The Google Analytics snippet takes care
    // of both unauthenticated and authenticated page views.
    const user = makeUserObject(state().user);
    if (!user || !user.id) {
      console.log('ignoring unauthenticated pageview');
      return Promise.resolve();
    }

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
    // in both Myst (e.g., to update their 'last seen' date in Intercom)
    // and Google Analytics (which we are still tracking using the
    // Google Analytics snippet for richer visitor data; e.g., referrer).
    if (isAuthenticated) {
      ga('create', config.googleAnalyticsID, user.id);

      const update = makeUserObject(user);
      dispatch({
        type: ANALYTICS_USER_UPDATE,
        payload: request
          .post(`${ANALYTICS_API}/user`)
          .send({ user: update })
      });
    } else {
      // Unauthenticated users are tracked with the default Google Analytics
      // behavior (e.g., anonymous, GA-generated UUID instead of Opsee user ID).
      ga('create', config.googleAnalyticsID, 'auto');
    }
  };
}