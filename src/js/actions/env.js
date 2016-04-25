/* eslint-disable */
import config from '../modules/config';
import request from '../modules/request';
import _ from 'lodash';
import {
  GET_GROUP_SECURITY,
  GET_GROUPS_SECURITY,
  GET_GROUP_ASG,
  GET_GROUPS_ASG,
  // GET_GROUP_RDS,
  // GET_GROUPS_RDS,
  GET_GROUP_ELB,
  GET_GROUPS_ELB,
  GET_INSTANCE_ECC,
  GET_INSTANCES_ECC,
  GET_INSTANCE_RDS,
  GET_INSTANCES_RDS,
  GET_METRIC_RDS,
  ENV_GET_BASTIONS,
  AWS_REBOOT_INSTANCES,
  AWS_START_INSTANCES,
  AWS_STOP_INSTANCES,
  ENV_GET_ALL
} from './constants';
import graphPromise from '../modules/graphPromise';

// export function getGroupSecurity(id){
//   return (dispatch, state) => {
//     dispatch({
//       type: GET_GROUP_SECURITY,
//       payload: new Promise((resolve, reject) => {
//         request
//         .get(`${config.services.api}/groups/security`)
//         .set('Authorization', state().user.get('auth'))
//         .then((res) => {
//           let group = res.body && res.body.groups && _.find(res.body.groups, (g) => {
//             return g.group.GroupId === id;
//           });
//           request
//           .get(`${config.services.api}/groups/security/${id}`)
//           .set('Authorization', state().user.get('auth'))
//           .then((res2) => {
//             group.instances = res2.body && res2.body.instances;
//             resolve({
//               data: group,
//               search: state().search
//             });
//           }, reject);
//         }, reject);
//       })
//     });
//   };
// }

export function getGroupSecurity(id){
  return (dispatch, state) => {
    dispatch({
      type: GET_GROUP_SECURITY,
      payload: graphPromise('region.vpc.groups', () => {
        return request
        .post(`${config.services.compost}`)
        .set('Authorization', state().user.get('auth'))
        .send({query: `
            {
              region(id: "us-west-1") {
                vpc(id: "vpc-79b1491c") {
                  groups(type: "security", id: "${id}"){
                    ... on ec2SecurityGroup {
                      GroupId
                      GroupName
                      Description
                    }
                  }
                }
              }
            }`
          })
        })
      })
    }
  }

// export function getGroupsSecurity(){
//   return (dispatch, state) => {
//     dispatch({
//       type: GET_GROUPS_SECURITY,
//       payload: new Promise((resolve, reject) => {
//         return request
//         .get(`${config.services.api}/groups/security`)
//         .set('Authorization', state().user.get('auth'))
//         .then(res => {
//           resolve({
//             data: res.body.groups,
//             search: state().search
//           });
//         }, reject);
//       })
//     });
//   };
// }

export function getGroupsSecurity(){
  return (dispatch, state) => {
    dispatch({
      type: GET_GROUPS_SECURITY,
      payload: graphPromise('region.vpc.groups', () => {
        return request
        .post(`${config.services.compost}`)
        .set('Authorization', state().user.get('auth'))
        .send({query: `
            {
              region(id: "us-west-1") {
                vpc(id: "vpc-79b1491c") {
                  groups(type: "security"){
                    ... on ec2SecurityGroup {
                      GroupId
                      GroupName
                      Description
                    }
                  }
                }
              }
            }`
          })
        })
      })
    }
  }

// export function getGroupElb(id){
//   return (dispatch, state) => {
//     dispatch({
//       type: GET_GROUP_ELB,
//       payload: new Promise((resolve, reject) => {
//         request
//         .get(`${config.services.api}/groups/elb`)
//         .set('Authorization', state().user.get('auth'))
//         .then((res) => {
//           let group = res.body && res.body.groups && _.find(res.body.groups, (g) => {
//             return g.group.LoadBalancerName === id;
//           });
//           request
//           .get(`${config.services.api}/groups/elb/${id}`)
//           .set('Authorization', state().user.get('auth'))
//           .then((res2) => {
//             group.instances = res2.body && res2.body.instances;
//             resolve({
//               data: group,
//               search: state().search
//             });
//           }, res2 => reject(res2));
//         }, res => reject(res));
//       })
//     });
//   };
// }

export function getGroupElb(id) {
  return (dispatch, state) => {
    dispatch({
      type: GET_GROUP_ELB,
      payload: graphPromise('region.vpc.groups', () => {
        return request
        .post(`${config.services.compost}`)
        .set('Authorization', state().user.get('auth'))
        .send({query: `
            {
              region(id: "us-west-1") {
                vpc(id: "vpc-79b1491c") {
                  groups(type: "elb", id: "${id}"){
                    ... on elbLoadBalancerDescription {
                      LoadBalancerName
                      CreatedTime
                      Instances {
                        InstanceId
                      }
                    }
                  }
                }
              }
            }`
          })
        })
      })
    }
  }

// export function getGroupsElb(){
//   return (dispatch, state) => {
//     dispatch({
//       type: GET_GROUPS_ELB,
//       payload: new Promise((resolve, reject) => {
//         return request
//         .get(`${config.services.api}/groups/elb`)
//         .set('Authorization', state().user.get('auth'))
//         .then(res => {
//           resolve({
//             data: res.body.groups,
//             search: state().search
//           });
//         }, reject);
//       })
//     });
//   };
// }

export function getGroupsElb(){
  return (dispatch, state) => {
    dispatch({
      type: GET_GROUPS_ELB,
      payload: graphPromise('region.vpc.groups', () => {
        return request
        .post(`${config.services.compost}`)
        .set('Authorization', state().user.get('auth'))
        .send({query: `
            {
              region(id: "us-west-1") {
                vpc(id: "vpc-79b1491c") {
                  groups(type: "elb"){
                    ... on elbLoadBalancerDescription {
                      LoadBalancerName
                    }
                  }
                }
              }
            }`
          })
        })
      })
    }
  }

export function getInstanceEcc(id){
  return (dispatch, state) => {
    dispatch({
      type: GET_INSTANCE_ECC,
      payload: graphPromise('region.vpc.instances', () => {
        return request
        .post(`${config.services.compost}`)
        .set('Authorization', state().user.get('auth'))
        .send({query: `
            {
              region(id: "us-west-1") {
                vpc(id: "vpc-79b1491c") {
                  instances(type: "ec2", id: "${id}"){
                    ... on ec2Instance {
                      Tags {
                        Key
                        Value
                      }
                      LaunchTime
                      InstanceType
                      InstanceId
                    }
                  }
                }
              }
            }`
          })
        })
      })
    }
  }

export function getInstancesEcc(){
  return (dispatch, state) => {
    dispatch({
      type: GET_INSTANCES_ECC,
      payload: graphPromise('region.vpc.instances', () => {
        return request
        .post(`${config.services.compost}`)
        .set('Authorization', state().user.get('auth'))
        .send({query: `
            {
              region(id: "us-west-1") {
                vpc(id: "vpc-79b1491c") {
                  instances(type: "ec2"){
                    ... on ec2Instance {
                      Tags {
                        Key
                        Value
                      }
                      InstanceId
                    }
                  }
                }
              }
            }`
          })
        })
      })
    }
  }

export function getInstancesRds(){
  return (dispatch, state) => {
    dispatch({
      type: GET_INSTANCES_RDS,
      payload: graphPromise('region.vpc.instances', () => {
        return request
        .post(`${config.services.compost}`)
        .set('Authorization', state().user.get('auth'))
        .send({query: `
            {
              region(id: "us-west-1") {
                vpc(id: "vpc-79b1491c") {
                  instances(type: "rds"){
                    ... on rdsDBInstance {
                      DBName
                      DBInstanceIdentifier
                    }
                  }
                }
              }
            }`
          })
        })
      })
    }
  }

export function getInstanceRds(id){
  return (dispatch, state) => {
    dispatch({
      type: GET_INSTANCE_RDS,
      payload: graphPromise('region.vpc.instances', () => {
        return request
        .post(`${config.services.compost}`)
        .set('Authorization', state().user.get('auth'))
        .send({query: `
            {
              region(id: "us-west-1") {
                vpc(id: "vpc-79b1491c") {
                  instances(type: "rds", id: "${id}"){
                    ... on rdsDBInstance {
                      #AllocatedStorage
                      AvailabilityZone
                      #BackupRetentionPeriod
                      CACertificateIdentifier
                      #DBClusterIdentifier
                      DBInstanceClass
                      DBInstanceIdentifier
                      #DbInstancePort
                      DBName
                      Endpoint{
                        Port
                        Address
                        HostedZoneId
                      }
                      EngineVersion
                      #Iops
                      InstanceCreateTime
                      #MultiAZ
                      #StorageType
                      #VpcSecurityGroups {
                      #  VpcSecurityGroupId
                      #  Status
                      #}
                    }
                  }
                }
              }
            }`
          })
        })
      })
    }
  }

/**
 * @param {string} id - the ID of the RDS instance (e.g., 'my-rds-instance')
 * @param {string} metric - the name of the metric (e.g., 'CPUUtilization')
 */

export function getMetricRDS(id, metric){
  return (dispatch, state) => {
    dispatch({
      type: GET_METRIC_RDS,
      payload: graphPromise('region.vpc.instances', () => {
        return request
        .post(`${config.services.compost}`)
        .set('Authorization', state().user.get('auth'))
        .send({query: `
            {
              region(id: "us-west-1") {
                vpc(id: "vpc-79b1491c") {
                  instances(type: "rds", id: "${id}"){
                    ... on rdsDBInstance {
                      DBName
                      DBInstanceIdentifier
                      metrics{
                        ${metric} {
                          metrics{
                            name
                            value
                            unit
                            timestamp
                          }
                        }
                      }
                    }
                  }
                }
              }
            }`
          })
        })
      })
    }
  }

export function getAll(){
  return (dispatch, state) => {
    dispatch({
      type: ENV_GET_ALL,
      payload: new Promise((resolve, reject) => {
        return request
        .post(`${config.services.compost}`)
        .set('Authorization', state().user.get('auth'))
        .send({query: `
            {
              region(id: "us-west-1") {
                vpc(id: "vpc-79b1491c") {
                  instances(type: "rds", id: "${id}"){
                    ... on ec2Instance {
                      InstanceId
                    }
                    ... on rdsDBInstance {
                      DBName
                      DBInstanceIdentifier
                    }
                  }
                }
              }
            }
          `})
        .then(res => {
          const errors = _.get(res, 'body.errors');
          if (Array.isArray(errors) && errors.length){
            return reject(errors[0]);
          }
          return resolve({
            data: _.get(res, 'body.data.region.vpc.instances'),
            search: state().search
          });
        }, reject);
      })
    });
  };
}

export function getAll(){
  return (dispatch, state) => {
    dispatch({
      type: ENV_GET_BASTIONS,
      payload: new Promise((resolve, reject) => {
        return request
        .post(`${config.services.compost}`)
        .set('Authorization', state().user.get('auth'))
        .send({query: `
            {
              region(id: "us-west-1") {
                vpc(id: "vpc-79b1491c") {
                  instances(type: "rds", id: "${id}"){
                    ... on ec2Instance {
                      InstanceId
                    }
                    ... on rdsDBInstance {
                      DBName
                      DBInstanceIdentifier
                    }
                  }
                }
              }
            }
          `})
        .then(res => {
          const errors = _.get(res, 'body.errors');
          if (Array.isArray(errors) && errors.length){
            return reject(errors[0]);
          }
          return resolve({
            data: _.get(res, 'body.data.region.vpc.instances'),
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
    return dispatch({
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
        .then(() => {
          resolve(InstanceIds);
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
        .then(() => {
          resolve(InstanceIds);
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
        .then(() => {
          resolve(InstanceIds);
        }, reject);
      })
    });
  };
}
/* eslint-enable */