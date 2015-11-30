import {pushState} from 'redux-router';
import config from '../modules/config';
import request from '../modules/request';
import {createAction} from 'redux-actions';
import _ from 'lodash';
import analytics from '../modules/analytics';
import {
  ONBOARD_SIGNUP_CREATE,
  ONBOARD_SET_PASSWORD,
  ONBOARD_VPC_SCAN,
  ONBOARD_INSTALL,
  ONBOARD_SET_CREDENTIALS,
  ONBOARD_SET_REGION,
  ONBOARD_SET_VPCS
} from './constants';
import storage from '../modules/storage';

export function signupCreate(data) {
  return (dispatch, state) => {
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
            dispatch(pushState(null, '/start/thanks'))
          }, 100);
        }, reject);
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
    setTimeout(() => {
      dispatch(pushState(null, '/start/credentials'));
    }, 100);
  }
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
        return request
        .post(`${config.api}/scan-vpcs`)
        .set('Authorization', state().user.get('auth'))
        .send(sendData)
        .then((res) => {
          resolve(res.body);
          //TODO remove timeout somehow
          let vpcs = _.chain(res.body).map(r => {
            return r.vpcs.map(v => {
              return v['vpc-id'];
            });
          }).flatten().value();
          dispatch({
            type: ONBOARD_SET_VPCS,
            payload: {vpcs}
          })
          if (vpcs.length){
            if (vpcs.length === 1 && !config.showVpcScreen){
              setTimeout(() => {
                dispatch(pushState(null, '/start/install'));
              }, 100);
            }else {
              setTimeout(() => {
                dispatch(pushState(null, '/start/vpc-select'));
              }, 100);
            }
          }else{
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

export function getBastionLaunchStatus(data) {
  return (dispatch, state) => {
    function is(){
      return !!(state().redux.app.socketMessages.filter({command: 'launch-bastion'}).length);
    }
    if(is()){
      return dispatch({
        type: ONBOARD_GET_BASTION_LAUNCH_STATUS,
        payload: true
      });
    }
    return setTimeout(() => {
      dispatch({
        type: ONBOARD_GET_BASTION_LAUNCH_STATUS,
        payload: is()
      });
    }, 17000);
  }
}