import {pushState} from 'redux-router';
import config from '../modules/config';
import request from '../modules/request';
import {createAction} from 'redux-actions';
import _ from 'lodash';
import * as analytics from './analytics';
import graphPromise from '../modules/graphPromise';
import {
  APP_SOCKET_MSG,
  ONBOARD_SIGNUP_CREATE,
  ONBOARD_VPC_SCAN,
  ONBOARD_VPC_SELECT,
  ONBOARD_INSTALL,
  ONBOARD_EXAMPLE_INSTALL,
  ONBOARD_MAKE_LAUNCH_TEMPLATE,
  ONBOARD_SET_CREDENTIALS,
  ONBOARD_SET_REGION,
  ONBOARD_GET_TEMPLATES,
  ONBOARD_SET_INSTALL_DATA,
  ONBOARD_SUBNET_SELECT,
  ONBOARD_SCAN_REGION
} from './constants';

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
            dispatch(pushState(null, `/start/thanks?referrer=${data.referrer}`));
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

export function getTemplates(){
  const base = 'https://s3.amazonaws.com/opsee-bastion-cf-us-east-1/beta';
  return (dispatch) => {
    dispatch({
      type: ONBOARD_GET_TEMPLATES,
      payload: new Promise((resolve, reject) => {
        const r1 = request.get(`${base}/bastion-ingress-cf.template`);
        const r2 = request.get(`${base}/bastion-cf.template`);
        const r3 = request.get(`${base}/opsee-role-annotated.json`);
        Promise.all([r1, r2, r3]).then(values => {
          resolve(values);
        }).catch(reject);
      })
    });
  };
}

export function setRegion(data) {
  return (dispatch, state) => {
    dispatch({
      type: ONBOARD_SET_REGION,
      payload: {region: data}
    });
    analytics.trackEvent('Onboard', 'region-select')(dispatch, state);
    getTemplates()(dispatch, state);
    setTimeout(() => {
      dispatch(pushState(null, '/s/add-instance'));
    }, 100);
  };
}

export function makeLaunchRoleUrlTemplate() {
  return (dispatch, state) => {
    dispatch({
      type: ONBOARD_MAKE_LAUNCH_TEMPLATE,
      payload: graphPromise('makeLaunchRoleUrlTemplate', () => {
        return request
          .post(`${config.services.compost}`)
          .set('Authorization', state().user.get('auth'))
          .send({query:
            `mutation Mutation {
              makeLaunchRoleUrlTemplate
            }`
          });
        })
    });
  };
}

export function scanRegion(region) {
  console.log('scanning region', region);
  return (dispatch, state) => {
    dispatch({
      type: ONBOARD_SCAN_REGION,
      payload: graphPromise('region.scan', () => {
        return request
          .post(`${config.services.compost}`)
          .set('Authorization', state().user.get('auth'))
          .send({query:
            `mutation Mutation {
              region(id: "${region}") {
                scan {
                  subnets {
                    routing
                    subnet_id
                  },
                  vpcs {
                    vpc_id,
                    instance_count
                  },
                }
              }
            }`
          });
        })
    })
  }
}

export const setCredentials = createAction(ONBOARD_SET_CREDENTIALS);

export function vpcScan(data) {
  return (dispatch, state) => {
    dispatch({
      type: ONBOARD_SET_CREDENTIALS,
      payload: data
    });
    const sendData = _.chain(data)
    .assign({
      regions: [state().onboard.region]
    })
    .pick(['access_key', 'secret_key', 'regions'])
    .value();
    dispatch({
      type: ONBOARD_VPC_SCAN,
      payload: new Promise((resolve, reject) => {
        analytics.trackEvent('Onboard', 'vpc-scan')(dispatch, state);
        if (config.onboardVpcScanError){
          return reject(new Error('config.onboardVpcScanError'));
        }
        return request
        .post(`${config.services.api}/vpcs/scan`)
        .set('Authorization', state().user.get('auth'))
        .send(sendData)
        .then((res) => {
          const regions = res.body.regions;
          if (Array.isArray(regions)){
            const bool = _.chain(regions).map('supported_platforms').map(platforms => {
              return !(platforms.indexOf('VPC') > -1);
            }).compact().some().value();
            if (bool){
              const message = 'One or more of the regions selected does not support VPCs. This probably indicates that a region in your account is AWS Classic. Opsee does not support Classic at this time. Please choose a different region or refer to our <a href="/help" target="_blank">Help Page</a>.';
              return reject({
                message
              });
            }
            resolve(regions);
            setTimeout(() => {
              dispatch(pushState(null, '/start/vpc-select'));
            }, 100);
          }
          return reject(new Error('Something went wrong trying to get VPCs.'));
        }, reject);
      })
    });
  };
}

export function vpcSelect(payload){
  return (dispatch, state) => {
    dispatch({
      type: ONBOARD_VPC_SELECT,
      payload
    });
    analytics.trackEvent('Onboard', 'vpc-select')(dispatch, state);
    setTimeout(() => {
      dispatch(pushState(null, '/start/subnet-select'));
    }, 100);
  };
}

export function subnetSelect(payload){
  return (dispatch, state) => {
    dispatch({
      type: ONBOARD_SUBNET_SELECT,
      payload
    });
    analytics.trackEvent('Onboard', 'subnet-select')(dispatch, state);
    setTimeout(() => dispatch({
      type: ONBOARD_SET_INSTALL_DATA
    }), 50);
  };
}

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

  let data = state().onboard.installData;
  data.region = _.chain(data.regions).head().get('region').value();
  data = _.assign(data, _.chain(data.regions).head().get('vpcs').head().value());
  data.vpc_id = data.id;
  const variables = _.pick(data, ['region', 'vpc_id', 'subnet_id', 'subnet_routing', 'instance_size']);

  debugger;
  return graphPromise('region.rebootInstances', () => {
    return request
    .post(`${config.services.compost}`)
    .set('Authorization', state().user.get('auth'))
    .send({
      query: `mutation launch($region: String!, $vpc_id: String!, $subnet_id: String!, $subnet_routing: String!, $instance_size: String!){
        region(id: $region) {
          launchStack(vpc_id: $vpc_id, subnet_id: $subnet_id, subnet_routing: $subnet_routing, instance_size: $instance_size)
        }
      }`,
      variables
    })
  })
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
        if (state().onboard.installData && !state().onboard.installing && !isBastionConnected(state)){
          return launch(dispatch, state, resolve, reject);
        }
        //we aren't sure at this point, so let's wait
        return setTimeout(() => {
          if (isBastionLaunching(state) || isBastionConnected(state)){
            return resolve();
          }
          dispatch(pushState(null, '/start/region-select'));
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