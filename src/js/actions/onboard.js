import config from '../modules/config';
import request from '../modules/request';
import {createAction} from 'redux-actions';
import _ from 'lodash';
import * as analytics from './analytics';
import graphPromise from '../modules/graphPromise';
import {
  APP_SOCKET_MSG,
  ONBOARD_SET_VPC,
  ONBOARD_INSTALL,
  ONBOARD_EXAMPLE_INSTALL,
  ONBOARD_MAKE_LAUNCH_TEMPLATE,
  ONBOARD_SET_CREDENTIALS,
  ONBOARD_SET_REGION,
  ONBOARD_GET_TEMPLATES,
  ONBOARD_SET_INSTALL_DATA,
  ONBOARD_SET_SUBNET,
  ONBOARD_SCAN_REGION,
  ONBOARD_HAS_ROLE,
  ONBOARD_SET_DEFAULT_NOTIFS,
  ONBOARD_GET_DEFAULT_NOTIFS,
  ONBOARD_SKIP_DEFAULT_NOTIFS
} from './constants';

function getRegion(state, region) {
  return graphPromise('region.scan', () => {
    return request
    .post(`${config.services.compost}`)
    .set('Authorization', state().user.get('auth'))
    .send({query:
      `mutation Mutation {
        region(id: "${region}") {
          scan {
            region
            subnets {
              subnet_id
              routing
              instance_count
              vpc_id
              tags {
                Key
                Value
              }
            },
            vpcs {
              vpc_id,
              instance_count
              tags {
                Key
                Value
              }
            },
          }
        }
      }`
    });
  });
}

function getRole(state) {
  return graphPromise('role', () => {
    return request
    .post(`${config.services.compost}`)
    .set('Authorization', state().user.get('auth'))
    .send({query:
      `{ role {
          region
          stack_id
        }}`
    });
  });
}

export function setInstallData(data) {
  return (dispatch, state) => {
    dispatch({
      type: ONBOARD_SET_INSTALL_DATA,
      payload: { data }
    });
    analytics.trackEvent('Onboard', 'set-install-data')(dispatch, state);
  };
}

export function setDefaultInstallData(regionData) {
  return (dispatch, state) => {
    const { region, vpcs, subnets } = regionData;
    const regionID = region;
    // Set the default VPC to be the first in the priority list
    const vpcID = _.chain(vpcs).head().get('vpc_id').value();
    // Set the default subnet to be the first in the priority list for the default VPC
    const subnetID = _.chain(subnets)
    .filter(subnet => subnet.vpc_id === vpcID)
    .head()
    .get('subnet_id')
    .value();
    return setInstallData({ regionID, vpcID, subnetID })(dispatch, state);
  };
}

export function updateInstallData() {
  return (dispatch, state) => {
    const onboardState = state().onboard;
    const regionID = _.get(onboardState, 'selectedRegion.id');
    const vpcID = _.get(onboardState, 'selectedVPC');
    const subnetID = _.get(onboardState, 'selectedSubnet');
    return setInstallData({ regionID, vpcID, subnetID })(dispatch, state);
  };
}

/*
 * Grabs the region from the user's role stack, fetches the VPCs/subnets in
 * that region, and persists Opsee's "best guess" VPC/subnet as the initial
 * installation data. Since this is a common action across several onboard
 * components on mount, it's easier to roll it into one action.
 */
export function initializeInstallation(){
  return (dispatch, state) => {
    getRole(state)
      .then(response => {
        dispatch({
          type: ONBOARD_HAS_ROLE,
          payload: response
        });
        return getRegion(state, _.get(response, 'data.region'));
      })
      .then(response => {
        dispatch({
          type: ONBOARD_SCAN_REGION,
          payload: response
        });
        setDefaultInstallData(response.data)(dispatch, state);
      });
  };
}

export function scanRegion(region) {
  return (dispatch, state) => {
    dispatch({
      type: ONBOARD_SCAN_REGION,
      payload: getRegion(state, region)
    });
  };
}

export function getTemplates(){
  const base = 'https://s3.amazonaws.com/opsee-bastion-cf-us-east-1/beta';
  return (dispatch) => {
    dispatch({
      type: ONBOARD_GET_TEMPLATES,
      payload: new Promise((resolve, reject) => {
        // FIXME use awsTemplates module and zip up results w/ keys
        // then shove it into props in reducer
        const r1 = request.get(`${base}/bastion-ingress-cf.template`);
        const r2 = request.get(`${base}/bastion-cf.template`);
        const r3 = request.get(`${base}/opsee-role-stack.json`);
        Promise.all([r1, r2, r3]).then(values => {
          resolve(values);
        }).catch(reject);
      })
    });
  };
}

/**
 * @params {string} region - the region ID (e.g., 'us-west-2')
 */
export function setRegion(region) {
  return (dispatch, state) => {
    dispatch({
      type: ONBOARD_SET_REGION,
      payload: { region }
    });
    analytics.trackEvent('Onboard', 'region-select')(dispatch, state);
    // Grab the updated VPCs/subnets for that region
    scanRegion(region)(dispatch, state);
  };
}

export function vpcSelect(data){
  const selectedVPC = _.get(data, 'selectedVPC');
  return (dispatch, state) => {
    dispatch({
      type: ONBOARD_SET_VPC,
      payload: selectedVPC
    });
    analytics.trackEvent('Onboard', 'vpc-select')(dispatch, state);
  };
}

export function subnetSelect(data){
  const selectedSubnet = _.get(data, 'selectedSubnet');
  return (dispatch, state) => {
    dispatch({
      type: ONBOARD_SET_SUBNET,
      payload: selectedSubnet
    });
    analytics.trackEvent('Onboard', 'subnet-select')(dispatch, state);
  };
}

export function makeLaunchRoleUrl() {
  return (dispatch, state) => {
    dispatch({
      type: ONBOARD_MAKE_LAUNCH_TEMPLATE,
      payload: graphPromise('makeLaunchRoleUrl', () => {
        return request
        .post(`${config.services.compost}`)
        .set('Authorization', state().user.get('auth'))
        .send({query:
          `mutation Mutation {
            makeLaunchRoleUrl
          }`
        });
      })
    });
    analytics.trackEvent('Onboard', 'make-launch-role-url')(dispatch, state);
  };
}

export function hasRole() {
  return (dispatch, state) => {
    dispatch({
      type: ONBOARD_HAS_ROLE,
      payload: getRole(state)
    });
  };
}

export function getDefaultNotifications() {
  return (dispatch, state) => {
    dispatch({
      type: ONBOARD_GET_DEFAULT_NOTIFS,
      payload: graphPromise('notifications', () => {
        return request
          .post(`${config.services.compost}`)
          .query({type: ONBOARD_GET_DEFAULT_NOTIFS})
          .set('Authorization', state().user.get('auth'))
          .send({query:
            `query defaultNotifs {
              notifications(default: true) {
                type
                value
              }
            }`
          });
      })
    });
  };
}

export function setDefaultNotifications(notifications) {
  return (dispatch, state) => {
    const validNotifications = _.filter(notifications, n => n.type && n.value);
    const variables = {
      notifications: validNotifications
    };
    dispatch({
      type: ONBOARD_SET_DEFAULT_NOTIFS,
      payload: graphPromise('notifications', () => {
        return request
          .post(`${config.services.compost}`)
          .query({type: ONBOARD_SET_DEFAULT_NOTIFS})
          .set('Authorization', state().user.get('auth'))
          .send({query: `
            mutation Mutation($notifications: [Notification]) {
              notifications(default: $notifications) {
                type
                value
              }
            }`, variables
          });
      })
    });
    analytics.trackEvent('Onboard', 'set-notifications')(dispatch, state);
  };
}

/*
 * Track whether a user has skipped the default notification set-up step in onboarding.
 * (An empty list of default notifications only implies that they don't have any,
 * which is not the same as skipping the step.)
 *
 * The drawback of doing it this way is that this prop is ephemeral -- it will be
 * lost if the user refreshes/opens in another tab/etc. unless we persist this
 * in the db (which is overkill for an attribute like this.).
 */
export const skipDefaultNotifications = createAction(ONBOARD_SKIP_DEFAULT_NOTIFS);

export const setCredentials = createAction(ONBOARD_SET_CREDENTIALS);

function isBastionLaunching(state){
  return !!_.filter(state().app.socketMessages, {command: 'launch-bastion'}).length ||
  !!_.filter(state().app.socketMessages, {command: 'connect-bastion'}).length ||
  state().onboard.installing;
}

function isBastionConnected(state){
  return _.chain(state().app.socketMessages)
  .filter({command: 'bastions'})
  .find(msg => {
    return _.chain(msg).get('attributes.bastions').find('connected').value();
  })
  .value();
}

function launch(dispatch, state, resolve, reject){
  // launchAttempts ++;
  analytics.trackEvent('Onboard', 'bastion-install')(dispatch, state);

  if (config.onboardInstallError){
    return reject(new Error('config.onboardInstallError'));
  }

  const variables = state().onboard.finalInstallData;
  return graphPromise('region.rebootInstances', () => {
    return request
    .post(`${config.services.compost}`)
    .set('Authorization', state().user.get('auth'))
    .send({
      query: `mutation launch($region: String!, $vpc_id: String!, $subnet_id: String!, $subnet_routing: String!){
        region(id: $region) {
          launchStack(vpc_id: $vpc_id, subnet_id: $subnet_id, subnet_routing: $subnet_routing)
        }
      }`,
      variables
    });
  });
}

export function install(){
  return (dispatch, state) => {
    return dispatch({
      type: ONBOARD_INSTALL,
      payload: new Promise((resolve, reject) => {
        //user has launched
        if (isBastionLaunching(state) || state().onboard.installing || isBastionConnected(state)){
          return resolve();
        }
        //user has install data but has not launched
        if (state().onboard.finalInstallData && !state().onboard.installing && !isBastionConnected(state)){
          return launch(dispatch, state, resolve, reject);
        }
        //we aren't sure at this point, so let's wait
        return setTimeout(() => {
          if (isBastionLaunching(state) || isBastionConnected(state)){
            return resolve();
          }
          return reject();
        }, 30000);
      })
    });
  };
}

let exampleMessages;
let exampleInstallFn;

if (process.env.NODE_ENV !== 'production'){
  const msgs = require('../../files/bastion-install-messages-example.json');
  exampleMessages = _.filter(msgs, {instance_id: '1r6k6YRB3Uzh0Bk5vmZsFU'});
  exampleInstallFn = () => {
    return (dispatch) => {
      return dispatch({
        type: ONBOARD_EXAMPLE_INSTALL,
        payload: new Promise(() => {
          exampleMessages.forEach((payload, i) => {
            setTimeout(() => {
              dispatch({
                type: APP_SOCKET_MSG,
                payload
              });
            }, i * 2000);
          });
          setTimeout(() => {
            dispatch({
              type: APP_SOCKET_MSG,
              payload: {
                command: 'connect-bastion',
                state: 'complete'
              }
            });
          }, (exampleMessages.length + 5) * 400);
        })
      });
    };
  };
}

export const exampleInstall = exampleInstallFn;