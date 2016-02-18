import config from '../modules/config';
import request from '../modules/request';
import _ from 'lodash';
import {
  GET_GROUP_SECURITY,
  GET_GROUPS_SECURITY,
  // GET_GROUP_RDS,
  // GET_GROUPS_RDS,
  GET_GROUP_ELB,
  GET_GROUPS_ELB,
  GET_INSTANCE_ECC,
  GET_INSTANCES_ECC,
  GET_INSTANCE_RDS,
  GET_INSTANCES_RDS,
  ENV_GET_BASTIONS,
  AWS_REBOOT_INSTANCES,
  AWS_START_INSTANCES,
  AWS_STOP_INSTANCES
} from './constants';

export function getGroupSecurity(id){
  return (dispatch, state) => {
    dispatch({
      type: GET_GROUP_SECURITY,
      payload: new Promise((resolve, reject) => {
        request
        .get(`${config.services.api}/groups/security`)
        .set('Authorization', state().user.get('auth'))
        .then((res) => {
          let group = res.body && res.body.groups && _.find(res.body.groups, (g) => {
            return g.group.GroupId === id;
          });
          request
          .get(`${config.services.api}/groups/security/${id}`)
          .set('Authorization', state().user.get('auth'))
          .then((res2) => {
            group.instances = res2.body && res2.body.instances;
            resolve({
              data: group,
              search: state().search
            });
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
        .get(`${config.services.api}/groups/security`)
        .set('Authorization', state().user.get('auth'))
        .then(res => {
          resolve({
            data: res.body.groups,
            search: state().search
          });
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
        .get(`${config.services.api}/groups/elb`)
        .set('Authorization', state().user.get('auth'))
        .then((res) => {
          let group = res.body && res.body.groups && _.find(res.body.groups, (g) => {
            return g.group.LoadBalancerName === id;
          });
          request
          .get(`${config.services.api}/groups/elb/${id}`)
          .set('Authorization', state().user.get('auth'))
          .then((res2) => {
            group.instances = res2.body && res2.body.instances;
            resolve({
              data: group,
              search: state().search
            });
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
        .get(`${config.services.api}/groups/elb`)
        .set('Authorization', state().user.get('auth'))
        .then(res => {
          resolve({
            data: res.body.groups,
            search: state().search
          });
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
        .get(`${config.services.api}/instances/ec2/${id}`)
        .set('Authorization', state().user.get('auth'))
        .then(res => {
          resolve({
            data: res.body,
            search: state().search
          });
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
        .get(`${config.services.api}/instances/ec2`)
        .set('Authorization', state().user.get('auth'))
        .then(res => {
          resolve({
            data: res.body.instances,
            search: state().search
          });
        }, reject);
      })
    });
  };
}

export function getInstancesRds(){
  return (dispatch, state) => {
    dispatch({
      type: GET_INSTANCES_RDS,
      payload: new Promise((resolve, reject) => {
        return request
        .get(`${config.services.api}/instances/rds`)
        .set('Authorization', state().user.get('auth'))
        .then(res => {
          resolve({
            data: res.body.instances,
            search: state().search
          });
        }, reject);
      })
    });
  };
}

export function getInstanceRds(id){
  return (dispatch, state) => {
    dispatch({
      type: GET_INSTANCE_RDS,
      payload: new Promise((resolve, reject) => {
        return request
        .get(`${config.services.api}/instances/rds/${id}`)
        .set('Authorization', state().user.get('auth'))
        .then(res => {
          resolve({
            data: res.body,
            search: state().search
          });
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
        .get(`${config.services.api}/vpcs/bastions`)
        .set('Authorization', state().user.get('auth'))
        .then(res => {
          const arr = _.get(res, 'body.bastions');
          if (!arr && process.env.NODE_ENV !== 'production'){
            console.error('No array from GET /bastions');
          }
          resolve(arr || []);
        }, reject);
      })
    });
  };
}

export function rebootInstances(InstanceIds){
  return (dispatch, state) => {
    dispatch({
      type: AWS_REBOOT_INSTANCES,
      payload: new Promise((resolve, reject) => {
        return request
        .post(`${config.services.api}/aws/reboot-instances`)
        .set('Authorization', state().user.get('auth'))
        .send({InstanceIds})
        .then(res => {
          resolve(res.body);
        }, reject);
      })
    });
  };
}

export function stopInstances(InstanceIds){
  return (dispatch, state) => {
    dispatch({
      type: AWS_STOP_INSTANCES,
      payload: new Promise((resolve, reject) => {
        return request
        .post(`${config.services.api}/aws/stop-instances`)
        .set('Authorization', state().user.get('auth'))
        .send({InstanceIds})
        .then(res => {
          resolve(res.body);
        }, reject);
      })
    });
  };
}

export function startInstances(InstanceIds){
  return (dispatch, state) => {
    dispatch({
      type: AWS_START_INSTANCES,
      payload: new Promise((resolve, reject) => {
        return request
        .post(`${config.services.api}/aws/start-instances`)
        .set('Authorization', state().user.get('auth'))
        .send({InstanceIds})
        .then(res => {
          resolve(res.body);
        }, reject);
      })
    });
  };
}