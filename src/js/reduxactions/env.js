import config from '../modules/config';
import request from '../modules/request';
import _ from 'lodash';
import {createAction} from 'redux-actions';
import {
  GET_GROUP_SECURITY,
  GET_GROUPS_SECURITY,
  // GET_GROUP_RDS,
  // GET_GROUPS_RDS,
  GET_GROUP_ELB,
  GET_GROUPS_ELB,
  GET_INSTANCE_ECC,
  GET_INSTANCES_ECC,
  FILTER_ENV,
  ENV_SET_SEARCH,
  ENV_GET_BASTIONS
  // GET_INSTANCE_RDS,
  // GET_INSTANCES_RDS
} from './constants';

export function getGroupSecurity(id){
  return (dispatch, state) => {
    // const filter = {
    //   type: FILTER_ENV,
    //   payload: {
    //     type: 'groups.security',
    //     id
    //   }
    // };
    // dispatch(filter);
    dispatch({
      type: GET_GROUP_SECURITY,
      payload: new Promise((resolve, reject) => {
        request
        .get(`${config.api}/groups/security`)
        .set('Authorization', state().user.get('auth'))
        .then((res) => {
          let group = res.body && res.body.groups && _.find(res.body.groups, (g) => {
            return g.group.GroupId === id;
          });
          request
          .get(`${config.api}/groups/security/${id}`)
          .set('Authorization', state().user.get('auth'))
          .then((res2) => {
            group.instances = res2.body && res2.body.instances;
            resolve(group);
          }, reject);
        }, reject);
      })
    });
  };
}

export function getGroupsSecurity(){
  return (dispatch, state) => {
    dispatch({
      type: GET_GROUPS_SECURITY,
      payload: new Promise((resolve, reject) => {
        return request
        .get(`${config.api}/groups/security`)
        .set('Authorization', state().user.get('auth'))
        .then(res => {
          resolve(res.body.groups);
        }, reject);
      })
    });
  };
}

export function getGroupElb(id){
  return (dispatch, state) => {
    dispatch({
      type: GET_GROUP_ELB,
      payload: new Promise((resolve, reject) => {
        request
        .get(`${config.api}/groups/elb`)
        .set('Authorization', state().user.get('auth'))
        .then((res) => {
          let group = res.body && res.body.groups && _.find(res.body.groups, (g) => {
            return g.group.LoadBalancerName === id;
          });
          request
          .get(`${config.api}/groups/elb/${id}`)
          .set('Authorization', state().user.get('auth'))
          .then((res2) => {
            group.instances = res2.body && res2.body.instances;
            resolve(group);
          }, res2 => reject(res2));
        }, res => reject(res));
      })
    });
  };
}

export function getGroupsElb(){
  return (dispatch, state) => {
    dispatch({
      type: GET_GROUPS_ELB,
      payload: new Promise((resolve, reject) => {
        return request
        .get(`${config.api}/groups/elb`)
        .set('Authorization', state().user.get('auth'))
        .then(res => {
          resolve(res.body.groups);
        }, reject);
      })
    });
  };
}

export function getInstanceEcc(id){
  return (dispatch, state) => {
    dispatch({
      type: GET_INSTANCE_ECC,
      payload: new Promise((resolve, reject) => {
        return request
        .get(`${config.api}/instances/ec2/${id}`)
        .set('Authorization', state().user.get('auth'))
        .then(res => {
          resolve(res.body);
        }, reject);
      })
    });
  };
}

export function getInstancesEcc(){
  return (dispatch, state) => {
    dispatch({
      type: GET_INSTANCES_ECC,
      payload: new Promise((resolve, reject) => {
        return request
        .get(`${config.api}/instances/ec2`)
        .set('Authorization', state().user.get('auth'))
        .then(res => {
          resolve(res.body.instances);
        }, reject);
      })
    });
  };
}

export function getBastions(){
  return (dispatch, state) => {
    if (!state().user.get('auth')){
      return Promise.resolve();
    }
    dispatch({
      type: ENV_GET_BASTIONS,
      payload: new Promise((resolve, reject) => {
        return request
        .get(`${config.api}/vpcs/bastions`)
        .set('Authorization', state().user.get('auth'))
        .then(res => {
          const arr = _.get(res, 'body.bastions');
          if (!arr && config.env !== 'production'){
            console.error('No array from GET /bastions');
          }
          resolve(arr || []);
        }, reject);
      })
    });
  };
}

export const filter = createAction(FILTER_ENV);

export const envSetSearch = createAction(ENV_SET_SEARCH);