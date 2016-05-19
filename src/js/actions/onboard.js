import {push} from 'redux-router';
import config from '../modules/config';
import request from '../modules/request';
import {createAction} from 'redux-actions';
import _ from 'lodash';
import * as analytics from './analytics';
import graphPromise from '../modules/graphPromise';
import {
  APP_SOCKET_MSG,
  ONBOARD_SIGNUP_CREATE,
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
  ONBOARD_HAS_ROLE
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

export function signupCreate(data) {
  return (dispatch, state) => {
    dispatch({
      type: ONBOARD_SIGNUP_CREATE,
      payload: new Promise((resolve, reject) => {
        return request
        .post(`${config.services.auth}/signups/new`)
        .send(data)
        .then((res) => {
          const user = res.body;
          analytics.trackEvent('Onboard', 'signup', data)(dispatch, state);
          resolve(user);

          //TODO remove timeout somehow
          setTimeout(() => {
            dispatch(push(`/start/thanks?referrer=${data.referrer}`));
          }, 100);
        }, err => {
          let msg = _.get(err, 'response.body.message');
          const r = msg ? new Error(msg) : err;
          reject(r);
        });
      })
    });
  };
}

export function setDefaultInstallData(regionData) {
  return (dispatch) => {
    const { region, vpcs, subnets } = regionData;
    const regionID = region;

    // Set the default VPC to be the first in the priority list
    const vpcID = _.chain(vpcs).first().get('vpc_id').value();

    // Set the default subnet to be the first in the priority list
    // for the default VPC
    const subnetID = _.chain(subnets).filter(subnet => subnet.vpc_id === vpcID).first().get('subnet_id').value();

    const data = { regionID, vpcID, subnetID };
    dispatch({
      type: ONBOARD_SET_INSTALL_DATA,
      payload: { data }
    });
  };
}

export function updateInstallData() {
  return (dispatch, state) => {
    const regionID = state().onboard.region;
    const vpcID = state().onboard.selectedVPC;
    const subnetID = state().onboard.selectedSubnet;
    const data = { regionID, vpcID, subnetID };

    dispatch({
      type: ONBOARD_SET_INSTALL_DATA,
      payload: { data }
    });
  };
}

/*
 * Grabs the region from the user's role stack, fetches the VPCs/subnets in
 * that region, and persists Opsee's "best guess" VPC/subnet as the initial
 * installation data.
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

export function setRegion(data) {
  const region = _.get(data, 'region');
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
          dispatch(push('/start/choose-region'));
          return reject();
        }, 30000);
      })
    });
  };
}

let exampleMessages;
let exampleInstallFn;

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

export const exampleInstall = exampleInstallFn;