import {pushState} from 'redux-router';
import config from '../modules/config';
import request from '../modules/request';
import {createAction} from 'redux-actions';
import _ from 'lodash';
import analytics from '../modules/analytics';
import {
  ONBOARD_SIGNUP_CREATE,
  ONBOARD_VPC_SCAN,
  ONBOARD_VPC_SELECT,
  ONBOARD_INSTALL,
  ONBOARD_SET_CREDENTIALS,
  ONBOARD_SET_REGION,
  ONBOARD_SET_INSTALL_DATA
} from './constants';

export function signupCreate(data) {
  return (dispatch) => {
    dispatch({
      type: ONBOARD_SIGNUP_CREATE,
      payload: new Promise((resolve, reject) => {
        return request
        .post(`${config.authApi}/signups`)
        .send(data)
        .then((res) => {
          resolve(res.body);
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
          resolve(res.body.regions);
          const subnets = _.chain(res.body.regions).pluck('subnets').flatten().value();
          if (subnets.length){
            if (subnets.length === 1 && !config.showVpcScreen){
              setTimeout(() => {
                dispatch({
                  type: ONBOARD_VPC_SELECT,
                  payload: subnets[0]
                });
                dispatch(pushState(null, '/start/install'));
              }, 100);
            }else {
              setTimeout(() => {
                dispatch(pushState(null, '/start/vpc-select'));
              }, 100);
            }
          }else {
            return reject(new Error('No vpcs found.'));
          }
        }, (err) => {
          let message = _.get(err, 'response.body.error') || err.response;
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
    dispatch({
      type: ONBOARD_SET_INSTALL_DATA
    });
    setTimeout(() => {
      dispatch(pushState(null, '/start/install'));
    }, 100);
  };
}

function isBastionLaunching(state){
  return !!_.filter(state().app.socketMessages, {command: 'launch-bastion'}).length;
}

// let launchAttempts = 0;

function launch(state, resolve, reject){
  // launchAttempts ++;
  analytics.event('Onboard', 'bastion-install');
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
            return launch(state, resolve, reject);
          }
          return dispatch(pushState(null, '/start/region-select'));
        }, retry ? 6000 : 17000);
      })
    });
  };
}