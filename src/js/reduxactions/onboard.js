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
  ONBOARD_VPC_SELECT,
  ONBOARD_INSTALL,
  ONBOARD_SET_CREDENTIALS,
  ONBOARD_SET_REGION,
  ONBOARD_GET_BASTION_LAUNCH_STATUS
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
          let vpcs = _.chain(res.body).map(r => {
            return r.vpcs.map(v => {
              return v['vpc-id'];
            });
          }).flatten().value();
          if (vpcs.length){
            if (vpcs.length === 1 && !config.showVpcScreen){
              setTimeout(() => {
                dispatch({
                  type: ONBOARD_VPC_SELECT,
                  payload: vpcs[0]
                });
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

export function vpcSelect(payload){
  return (dispatch, state) => {
    dispatch({
      type: ONBOARD_VPC_SELECT,
      payload
    });
    setTimeout(() => {
      dispatch(pushState(null, '/start/install'));
    }, 100);
  }
}

export function getBastionLaunchStatus(data) {
  return (dispatch, state) => {
    function is(){
      return !!_.filter(state().app.socketMessages, {command: 'launch-bastion'}).length;
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

function getFinalInstallData(state){
  const data = state().onboard;

  const regions = _.chain(data.vpcs).filter('selected');

  let relation = data.vpcs.map((v) => {
    let newVpc;
    Store.getAvailableVpcs().forEach(r => {
      r.vpcs.forEach(rvpc => {
        if (rvpc['vpc-id'] === v){
          /* eslint-disable camelcase */
          const subnet_id = _.chain(rvpc.subnets).sortByAll([(t)=>t.state === 'available', 'default-for-az', 'available-ip-address-count']).last().get('subnet-id').value();
          newVpc = {id: v, region: r.region, subnet_id};
          /* eslint-enable camelcase */
        }
      });
    });
    return newVpc.id ? newVpc : false;
  });
  if (!_.every(relation) || !relation.length){
    return false;
  }
  //TODO fix this so it works with multiple vpcs later
  relation = relation.map(r => {
    return {
      region: r.region,
      vpcs: [{id: r.id, subnet_id: r.subnet_id}]
    };
  });
  let aggregate = _.assign({}, data, {regions: relation}, {'instance-size': 't2.micro'});
  delete aggregate.vpcs;
  return aggregate;
}

function isBastionLaunching(state){
  return !!_.filter(state().app.socketMessages, {command: 'launch-bastion'}).length;
}

function launch(state, resolve, reject){
  analytics.event('Onboard', 'bastion-install');
  const data = _.assign({}, state().onboard);
  request
  .post(`${config.api}/bastions/launch`)
  .set('Authorization', state().user.get('auth'))
  .send(data)
  .then(resolve, reject)
}

export function install(){
  return (dispatch, state) => {
    return dispatch({
      type: ONBOARD_INSTALL,
      payload: new Promise((resolve, reject) => {
        if(isBastionLaunching(state)){
          return resolve();
        }
        setTimeout(() => {
          return isBastionLaunching() ? resolve() : launch(state, resolve, reject);
        }, 17000)
      })
    })
  }
}