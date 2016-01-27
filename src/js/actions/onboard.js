import {pushState} from 'redux-router';
import config from '../modules/config';
import request from '../modules/request';
import {createAction} from 'redux-actions';
import _ from 'lodash';
import * as analytics from './analytics';
import {
  APP_SOCKET_MSG,
  ONBOARD_SIGNUP_CREATE,
  ONBOARD_VPC_SCAN,
  ONBOARD_VPC_SELECT,
  ONBOARD_INSTALL,
  ONBOARD_EXAMPLE_INSTALL,
  ONBOARD_SET_CREDENTIALS,
  ONBOARD_SET_REGION,
  ONBOARD_SET_INSTALL_DATA,
  ONBOARD_SUBNET_SELECT
} from './constants';

export function signupCreate(data) {
  return (dispatch, state) => {
    dispatch({
      type: ONBOARD_SIGNUP_CREATE,
      payload: new Promise((resolve, reject) => {
        return request
        .post(`${config.authApi}/signups`)
        .send(data)
        .then((res) => {
          const user = res.body;
          analytics.trackEvent('Onboard', 'signup', data)(dispatch, state);
          resolve(user);

          //TODO remove timeout somehow
          setTimeout(() => {
            dispatch(pushState(null, '/start/thanks'));
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

export function setRegion(data) {
  return (dispatch) => {
    dispatch({
      type: ONBOARD_SET_REGION,
      payload: {region: data}
    });
    setTimeout(() => {
      dispatch(pushState(null, '/start/credentials'));
    }, 100);
  };
}

export const setCredentials = createAction(ONBOARD_SET_CREDENTIALS);

export function vpcScan(data) {
  return (dispatch, state) => {
    dispatch({
      type: ONBOARD_SET_CREDENTIALS,
      payload: data
    });
    const sendData = _.assign({}, data, {regions: [state().onboard.region]});
    dispatch({
      type: ONBOARD_VPC_SCAN,
      payload: new Promise((resolve, reject) => {
        if (config.onboardVpcScanError){
          return reject(new Error('config.onboardVpcScanError'));
        }
        return request
        .post(`${config.api}/vpcs/scan`)
        .set('Authorization', state().user.get('auth'))
        .send(sendData)
        .then((res) => {
          const regions = res.body.regions;
          if (Array.isArray(regions)){
            const bool = _.chain(regions).pluck('supported_platforms').map(platforms => {
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
          return reject({
            message: 'Something went wrong trying to get VPCs.'
          });
        }, (err) => {
          let message = err.message || err.response;
          return reject({message});
        });
      })
    });
  };
}

export function vpcSelect(payload){
  return (dispatch) => {
    dispatch({
      type: ONBOARD_VPC_SELECT,
      payload
    });
    setTimeout(() => {
      dispatch(pushState(null, '/start/subnet-select'));
    }, 100);
  };
}

export function subnetSelect(payload){
  return (dispatch) => {
    dispatch({
      type: ONBOARD_SUBNET_SELECT,
      payload
    });
    dispatch({
      type: ONBOARD_SET_INSTALL_DATA
    });
    setTimeout(() => {
      dispatch(pushState(null, '/start/install'));
    }, 100);
  };
}

function isBastionLaunching(state){
  return !!_.filter(state().app.socketMessages, {command: 'launch-bastion'}).length ||
  !!_.filter(state().app.socketMessages, {command: 'connect-bastion'}).length;
}

// let launchAttempts = 0;

function launch(dispatch, state, resolve, reject){
  // launchAttempts ++;
  analytics.trackEvent('Onboard', 'bastion-install')(dispatch, state);

  if (config.onboardInstallError){
    return reject(new Error('config.onboardInstallError'));
  }
  request
  .post(`${config.api}/vpcs/launch`)
  .set('Authorization', state().user.get('auth'))
  .send(state().onboard.installData)
  .then(resolve, (err) => {
    //save this for retrying later
    // if (launchAttempts < 0){
    //   return setTimeout(() => {
    //     launch(state, resolve, reject);
    //   }, 5000);
    // }
    return reject(err);
  });
}

export function install(retry){
  return (dispatch, state) => {
    return dispatch({
      type: ONBOARD_INSTALL,
      payload: new Promise((resolve, reject) => {
        if (isBastionLaunching(state)){
          return resolve();
        }
        setTimeout(() => {
          if (isBastionLaunching(state)){
            return resolve();
          }else if (state().onboard.installData){
            return launch(dispatch, state, resolve, reject);
          }
          return dispatch(pushState(null, '/start/region-select'));
        }, retry ? 6000 : 17000);
      })
    });
  };
}

let exampleMessages;
let exampleInstallFn;
if (config.env !== 'production'){
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
            }, i * 400);
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