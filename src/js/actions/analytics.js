import _ from 'lodash';

import config from '../modules/config';
import ga from '../modules/ga';
import request from '../modules/request';
import {User} from '../modules/schemas';
import {
  ANALYTICS_EVENT,
  ANALYTICS_PAGEVIEW,
  ANALYTICS_USER_UPDATE,
  INTERCOM_SHOW,
  INTERCOM_HIDE
} from './constants';

const ANALYTICS_API = config.services.analytics;

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
    //user is ghosting
    if (state().user && state().user.toJS && state().user.get('ghosting')){
      return Promise.resolve();
    }

    const name = title || document.title;
    const user = makeUserObject(state().user);

    // Track both authenticated and unauthenticated users in Google Analytics.
    // The GA snippet will be identified by the user's user ID or generated
    // UUID, respectively.
    ga('send', 'pageview', {
      page: path,
      title: name
    });

    // Only authenticated page views are tracked in Myst (for Intercom)
    // to update the 'last seen' time.
    if (!user || !user.id) {
      return Promise.resolve();
    }

    // Tell intercom we're on a new page in the event that there are any messages
    // that we need to show
    if (window.Intercom) {
      window.Intercom('update');
    }

    return dispatch({
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
    //user is ghosting
    if (state().user && state().user.toJS && state().user.get('ghosting')){
      return Promise.resolve();
    }

    if (!category){
      if (process.env.NODE_ENV !== 'production'){
        console.warn('No category supplied to analytics event');
      }
      return Promise.resolve();
    }

    // FIXME remove when LaunchDarkly tracked in Myst
    if (window.ldclient){
      window.ldclient.track(`${category} - ${action}`, data);
    }

    // Track the event in GA so we can get browser context (referrer, etc.)
    const stringData = typeof data === 'string' ? data : JSON.stringify(data);
    window.ga('send', 'event', category, action, stringData);

    // Track the event in Myst (for Intercom, etc.)
    const user = makeUserObject(userData || state().user);
    return dispatch({
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

    // The user in state has attributes that updatedUser does not have, since
    // the latter is only profile information. However, the profile information
    // in state().user could be stale, so we only use that for id.
    const update = _.assign({}, {user_id: state().user.get('id')}, updatedUser);

    return dispatch({
      type: ANALYTICS_USER_UPDATE,
      payload: request
        .post(`${ANALYTICS_API}/user`)
        .send({ user: update })
    });
  };
}

export function initialize() {
  return (dispatch, state) => {
    const user = (state().user || new User()).toJS();
    // ld needs to be loaded even if user is ghosting for features to work
    // there are no analytics in LD so it's nbd
    // FIXME Remove when Launch Darkly added to Myst
    if (window.ldclient){
      window.ldclient.identify({
        firstName: user.name,
        key: (user.id || '').toString(),
        email: user.email,
        custom: {
          customer_id: user.customer_id,
          id: user.id,
          admin: !!user.admin
        }
      });
    }

    //user is ghosting
    if (user && user.ghosting){
      return Promise.resolve();
    }

    const isAuthenticated = !!(user.token && user.id);

    // If the user is authenticated, we can initialize them with their identity
    // in both Myst (e.g., to update their 'last seen' date in Intercom)
    // and Google Analytics (which we are still tracking using the
    // Google Analytics snippet for richer visitor data; e.g., referrer).
    if (isAuthenticated) {
      // Created a GA visitor for the authenticated user, using their Opsee ID
      // as their visitor ID. (This allows us to track logged-in users across
      // multiple devices.)
      ga('create', config.googleAnalyticsID, user.id);

      // Basic-ally, we are duplicating myst / intercom here, but we want to show
      // the intercom messenger so we need this
      if (window.Intercom && user.name && user.email) {
        const createdAt = Math.floor((user.created_at || new Date().getTime()) / 1000);

        window.Intercom('boot', {
          app_id: 'mrw1z4dm',
          name: user.name,
          email: user.email,
          created_at: createdAt,
          user_hash: user.intercom_hmac,
          widget: {
            activator: '#Intercom'
          }
        });
        window.Intercom('onShow', () => dispatch({
          type: INTERCOM_SHOW
        }));
        window.Intercom('onHide', () => dispatch({
          type: INTERCOM_HIDE
        }));
      }

      // Sync the user with Myst/Intercom
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
    return true;
  };
}

export function shutdown() {
  return () => {
    if (window.Intercom) {
      window.Intercom('shutdown');
    }

    // Revert to an unauthenticated visitor on logout.
    ga('create', config.googleAnalyticsID, 'auto');
  };
}