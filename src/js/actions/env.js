import {createAction} from 'redux-actions';
import config from '../modules/config';
import request from '../modules/request';
import _ from 'lodash';
import {
  GET_GROUP_SECURITY,
  GET_GROUPS_SECURITY,
  GET_GROUP_ASG,
  GET_GROUPS_ASG,
  GET_GROUP_ELB,
  GET_GROUPS_ELB,
  GET_GROUP_ECS,
  GET_GROUPS_ECS,
  GET_TASK_DEFINITION,
  GET_INSTANCE_ECC,
  GET_INSTANCES_ECC,
  GET_INSTANCE_RDS,
  GET_INSTANCES_RDS,
  GET_METRIC_RDS,
  GET_METRIC_ECC,
  GET_METRIC_ASG,
  GET_METRIC_ECS,
  ENV_GET_BASTIONS,
  ENV_SELECT_TOGGLE,
  ENV_GET_ALL,
  AWS_REBOOT_INSTANCES,
  AWS_START_INSTANCES,
  AWS_STOP_INSTANCES
} from './constants';
import graphPromise from '../modules/graphPromise';

const snippets = {
  groups: {
    security: {
      short: `GroupId
              GroupName
              Description`
    },
    asg: {
      short: `Tags {
                Key
                Value
              }
              LoadBalancerNames
              AutoScalingGroupName
              Instances {
                InstanceId
              }`
    },
    elb: {
      short: `LoadBalancerName
              Instances {
                InstanceId
              }`
    },
    ecs: {
      short: `ServiceName
              Status
              ServiceName
              ClusterArn
              TaskDefinition
              Deployments {
                TaskDefinition
              }
              `
    }
  },
  instances: {
    ecc: {
      short: `Tags {
                Key
                Value
              }
              InstanceId
              PrivateIpAddress
              SecurityGroups {
                GroupId
              }`
    },
    rds: {
      short: `DBName
              DBInstanceIdentifier`
    }
  }
};

export function getGroupSecurity(id){
  return (dispatch, state) => {
    dispatch({
      type: GET_GROUP_SECURITY,
      payload: graphPromise('region.vpc', () => {
        return request
        .post(`${config.services.compost}`)
        .query({type: GET_GROUP_SECURITY})
        .set('Authorization', state().user.get('auth'))
        .send({
          query: `query Query($region: String!, $vpc: String!){
              region(id: $region) {
                vpc(id: $vpc) {
                  groups(type: "security", id: "${id}"){
                    ... on ec2SecurityGroup {
                      ${snippets.groups.security.short}
                    }
                  }
                  instances(type: "ec2"){
                    ... on ec2Instance {
                      ${snippets.instances.ecc.short}
                    }
                  }
                }
              }
            }`,
          variables: _.pick(state().env, ['region', 'vpc'])
        });
      }, {search: state().search})
    });
  };
}

export function getGroupsSecurity(){
  return (dispatch, state) => {
    dispatch({
      type: GET_GROUPS_SECURITY,
      payload: graphPromise('region.vpc', () => {
        return request
        .post(`${config.services.compost}`)
        .query({type: GET_GROUPS_SECURITY})
        .set('Authorization', state().user.get('auth'))
        .send({
          query: `query Query($region: String!, $vpc: String!){
              region(id: $region) {
                vpc(id: $vpc) {
                  groups(type: "security"){
                    ... on ec2SecurityGroup {
                      ${snippets.groups.security.short}
                    }
                  }
                  instances(type: "ec2"){
                    ... on ec2Instance {
                      ${snippets.instances.ecc.short}
                    }
                  }
                }
              }
            }`,
          variables: _.pick(state().env, ['region', 'vpc'])
        });
      }, {search: state().search})
    });
  };
}

export function getGroupAsg(id){
  return (dispatch, state) => {
    dispatch({
      type: GET_GROUP_ASG,
      payload: graphPromise('region.vpc.groups', () => {
        return request
        .post(`${config.services.compost}`)
        .query({type: GET_GROUP_ASG})
        .set('Authorization', state().user.get('auth'))
        .send({
          query: `query Query($region: String!, $vpc: String!){
              region(id: $region) {
                vpc(id: $vpc) {
                  groups(type: "autoscaling", id: "${id}"){
                    ... on autoscalingGroup {
                      Tags {
                        Key
                        Value
                      }
                      LoadBalancerNames
                      AutoScalingGroupName
                      Instances {
                        InstanceId
                      }
                      Status
                      CreatedTime
                      MinSize
                      MaxSize
                      DesiredCapacity
                      AvailabilityZones
                      SuspendedProcesses {
                        ProcessName
                        SuspensionReason
                      }
                    }
                  }
                }
              }
            }`,
          variables: _.pick(state().env, ['region', 'vpc'])
        });
      }, {search: state().search, id})
    });
  };
}

export function getGroupsAsg(){
  return (dispatch, state) => {
    dispatch({
      type: GET_GROUPS_ASG,
      payload: graphPromise('region.vpc.groups', () => {
        return request
        .post(`${config.services.compost}`)
        .query({type: GET_GROUPS_ASG})
        .set('Authorization', state().user.get('auth'))
        .send({
          query: `query Query($region: String!, $vpc: String!){
              region(id: $region) {
                vpc(id: $vpc) {
                  groups(type: "autoscaling"){
                    ... on autoscalingGroup {
                      ${snippets.groups.asg.short}
                    }
                  }
                }
              }
            }`,
          variables: _.pick(state().env, ['region', 'vpc'])
        });
      }, {search: state().search})
    });
  };
}

export function getGroupElb(id) {
  return (dispatch, state) => {
    dispatch({
      type: GET_GROUP_ELB,
      payload: graphPromise('region.vpc.groups', () => {
        return request
        .post(`${config.services.compost}`)
        .query({type: GET_GROUP_ELB})
        .set('Authorization', state().user.get('auth'))
        .send({
          query: `query Query($region: String!, $vpc: String!){
            region(id: $region) {
              vpc(id: $vpc) {
                groups(type: "elb", id: "${id}"){
                  ... on elbLoadBalancerDescription {
                    LoadBalancerName
                    CreatedTime
                    Instances {
                      InstanceId
                    }
                    ListenerDescriptions {
                      Listener {
                        Protocol
                        InstancePort
                        LoadBalancerPort
                      }
                    }
                  }
                }
              }
            }
          }`,
          variables: _.pick(state().env, ['region', 'vpc'])
        });
      }, {search: state().search})
    });
  };
}

export function getGroupsElb(){
  return (dispatch, state) => {
    dispatch({
      type: GET_GROUPS_ELB,
      payload: graphPromise('region.vpc.groups', () => {
        return request
        .post(`${config.services.compost}`)
        .query({type: GET_GROUPS_ELB})
        .set('Authorization', state().user.get('auth'))
        .send({
          query: `query Query($region: String!, $vpc: String!){
            region(id: $region) {
              vpc(id: $vpc) {
                groups(type: "elb"){
                  ... on elbLoadBalancerDescription {
                    ${snippets.groups.elb.short}
                  }
                }
              }
            }
          }`,
          variables: _.pick(state().env, ['region', 'vpc'])
        });
      }, {search: state().search})
    });
  };
}

export function getGroupEcs(id){
  // const id = ident.replace('»', '\0');
  //.replace(/\//g, '%2F');
  return (dispatch, state) => {
    dispatch({
      type: GET_GROUP_ECS,
      payload: graphPromise('region.vpc.groups', () => {
        return request
        .post(`${config.services.compost}`)
        .query({type: GET_GROUP_ECS})
        .set('Authorization', state().user.get('auth'))
        .send({
          query: `query Query($region: String!, $vpc: String!){
              region(id: $region) {
                vpc(id: $vpc) {
                  groups(type: "ecs_service", id: "${id}"){
                    ... on ecsService {
                      DesiredCount
                      Status
                      Deployments {
                        RunningCount
                        Status
                        TaskDefinition
                        UpdatedAt
                        CreatedAt
                        DesiredCount
                        Id
                        PendingCount
                      }
                      RoleArn
                      ServiceArn
                      ClusterArn
                      Events {
                        CreatedAt
                        Id
                        Message
                      }
                      LoadBalancers {
                        ContainerName
                        ContainerPort
                        LoadBalancerName
                      }
                      CreatedAt
                      PendingCount
                      RunningCount
                      TaskDefinition
                      DeploymentConfiguration {
                        MaximumPercent
                        MinimumHealthyPercent
                      }
                      ServiceName
                    }
                  }
                }
              }
            }`,
          variables: _.pick(state().env, ['region', 'vpc'])
        });
      }, {search: state().search, id})
    });
  };
}

export function getGroupsEcs(){
  return (dispatch, state) => {
    dispatch({
      type: GET_GROUPS_ECS,
      payload: graphPromise('region.vpc.groups', () => {
        return request
        .post(`${config.services.compost}`)
        .query({type: GET_GROUPS_ECS})
        .set('Authorization', state().user.get('auth'))
        .send({
          query: `query Query($region: String!, $vpc: String!){
              region(id: $region) {
                vpc(id: $vpc) {
                  groups(type: "ecs_service"){
                    ... on ecsService {
                      ${snippets.groups.ecs.short}
                    }
                  }
                }
              }
            }`,
          variables: _.pick(state().env, ['region', 'vpc'])
        });
      }, {search: state().search})
    });
  };
}

export function getTaskDefinition(string = ''){
  const id = _.last(string.split('/')) || '';
  return (dispatch, state) => {
    dispatch({
      type: GET_TASK_DEFINITION,
      payload: graphPromise('region.task_definition', () => {
        return request
        .post(`${config.services.compost}`)
        .query({type: GET_TASK_DEFINITION})
        .set('Authorization', state().user.get('auth'))
        .send({
          query: `query Query($region: String!){
              region(id: $region) {
                task_definition(id: "${id}") {
                  TaskDefinitionArn
                  ContainerDefinitions {
                    Name
                    PortMappings {
                      ContainerPort
                      HostPort
                      Protocol
                    }
                  }
                }
              }
            }`,
          variables: _.pick(state().env, ['region'])
        });
      }, {search: state().search, id})
    });
  };
}


export function getInstanceEcc(id){
  return (dispatch, state) => {
    dispatch({
      type: GET_INSTANCE_ECC,
      payload: graphPromise('region.vpc.instances', () => {
        return request
        .post(`${config.services.compost}`)
        .query({type: GET_INSTANCE_ECC})
        .set('Authorization', state().user.get('auth'))
        .send({
          query: `query Query($region: String!, $vpc: String!){
            region(id: $region) {
              vpc(id: $vpc) {
                instances(type: "ec2", id: "${id}"){
                  ... on ec2Instance {
                    Tags {
                      Key
                      Value
                    }
                    LaunchTime
                    InstanceType
                    InstanceId
                    PrivateIpAddress
                    SecurityGroups {
                      GroupId
                    }
                  }
                }
              }
            }
          }`,
          variables: _.pick(state().env, ['region', 'vpc'])
        });
      }, {search: state().search})
    });
  };
}

export function getInstancesEcc(){
  return (dispatch, state) => {
    dispatch({
      type: GET_INSTANCES_ECC,
      payload: graphPromise('region.vpc.instances', () => {
        return request
        .post(`${config.services.compost}`)
        .query({type: GET_INSTANCES_ECC})
        .set('Authorization', state().user.get('auth'))
        .send({
          query: `query Query($region: String!, $vpc: String!){
            region(id: $region) {
              vpc(id: $vpc) {
                instances(type: "ec2"){
                  ... on ec2Instance {
                    ${snippets.instances.ecc.short}
                  }
                }
              }
            }
          }`,
          variables: _.pick(state().env, ['region', 'vpc'])
        });
      }, {search: state().search})
    });
  };
}

export function getInstancesRds(){
  return (dispatch, state) => {
    dispatch({
      type: GET_INSTANCES_RDS,
      payload: graphPromise('region.vpc.instances', () => {
        return request
        .post(`${config.services.compost}`)
        .query({type: GET_INSTANCES_RDS})
        .set('Authorization', state().user.get('auth'))
        .send({
          query: `query Query($region: String!, $vpc: String!){
            region(id: $region) {
              vpc(id: $vpc) {
                instances(type: "rds"){
                  ... on rdsDBInstance {
                    ${snippets.instances.rds.short}
                  }
                }
              }
            }
          }`,
          variables: _.pick(state().env, ['region', 'vpc'])
        });
      }, {search: state().search})
    });
  };
}

export function getInstanceRds(id){
  return (dispatch, state) => {
    dispatch({
      type: GET_INSTANCE_RDS,
      payload: graphPromise('region.vpc.instances', () => {
        return request
        .post(`${config.services.compost}`)
        .query({type: GET_INSTANCE_RDS})
        .set('Authorization', state().user.get('auth'))
        .send({
          query: `query Query($region: String!, $vpc: String!){
            region(id: $region) {
              vpc(id: $vpc) {
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
          }`,
          variables: _.pick(state().env, ['region', 'vpc'])
        });
      }, {search: state().search})
    });
  };
}

export function getBastions(){
  return (dispatch, state) => {
    if (!state().user.get('auth')){
      return dispatch({
        type: ENV_GET_BASTIONS,
        payload: []
      });
      // return Promise.resolve([]);
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
        .query({type: GET_METRIC_RDS})
        .set('Authorization', state().user.get('auth'))
        .send({
          query: `query Query($region: String!, $vpc: String!){
            region(id: $region) {
              vpc(id: $vpc) {
                instances(type: "rds", id: "${id}"){
                  ... on rdsDBInstance {
                    ${snippets.instances.rds.short}
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
          }`,
          variables: _.pick(state().env, ['region', 'vpc'])
        });
      }, {search: state().search})
    });
  };
}

export function getMetricECC(id, metric){
  return (dispatch, state) => {
    dispatch({
      type: GET_METRIC_ECC,
      payload: graphPromise('region.vpc.instances', () => {
        return request
        .post(`${config.services.compost}`)
        .query({type: GET_METRIC_ECC})
        .set('Authorization', state().user.get('auth'))
        .send({
          query: `query Query($region: String!, $vpc: String!){
            region(id: $region) {
              vpc(id: $vpc) {
                instances(type: "ec2", id: "${id}"){
                  ... on ec2Instance {
                    ${snippets.instances.ecc.short}
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
          }`,
          variables: _.pick(state().env, ['region', 'vpc'])
        });
      }, {search: state().search})
    });
  };
}

export function getMetricASG(id, metric){
  return (dispatch, state) => {
    dispatch({
      type: GET_METRIC_ASG,
      payload: graphPromise('region.vpc.groups', () => {
        return request
        .post(`${config.services.compost}`)
        .query({type: GET_METRIC_ASG})
        .set('Authorization', state().user.get('auth'))
        .send({
          query: `query Query($region: String!, $vpc: String!){
            region(id: $region) {
              vpc(id: $vpc) {
                groups(type: "autoscaling", id: "${id}"){
                  ... on autoscalingGroup {
                    ${snippets.groups.asg.short}
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
          }`,
          variables: _.pick(state().env, ['region', 'vpc'])
        });
      }, {search: state().search})
    });
  };
}

export function getMetricECS(id, metric){
  return (dispatch, state) => {
    dispatch({
      type: GET_METRIC_ECS,
      payload: graphPromise('region.vpc.groups', () => {
        return request
        .post(`${config.services.compost}`)
        .query({type: GET_METRIC_ECS})
        .set('Authorization', state().user.get('auth'))
        .send({
          query: `query Query($region: String!, $vpc: String!){
            region(id: $region) {
              vpc(id: $vpc) {
                groups(type: "ecs_service", id: "${id}"){
                  ... on ecsService {
                    RoleArn
                    ServiceArn
                    ClusterArn
                    ServiceName
                    metrics {
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
          }`,
          variables: _.pick(state().env, ['region', 'vpc'])
        });
      }, {search: state().search})
    });
  };
}

export function all(){
  return (dispatch, state) => {
    dispatch({
      type: ENV_GET_ALL,
      payload: graphPromise('region.vpc', () => {
        return request
        .post(`${config.services.compost}`)
        .query({type: ENV_GET_ALL})
        .set('Authorization', state().user.get('auth'))
        .send({
          query: `query Query($region: String!, $vpc: String!){
              region(id: $region) {
                vpc(id: $vpc) {
                  groups {
                    ... on ec2SecurityGroup {
                      ${snippets.groups.security.short}
                    }
                    ... on autoscalingGroup {
                      ${snippets.groups.asg.short}
                    }
                  }
                  instances {
                    ... on ec2Instance {
                      ${snippets.instances.ecc.short}
                    }
                  }
                }
              }
            }`,
          variables: _.pick(state().env, ['region', 'vpc'])
        });
      }, {search: state().search})
    });
  };
}

export function rebootInstances(ids = []){
  return (dispatch, state) => {
    dispatch({
      type: AWS_REBOOT_INSTANCES,
      payload: graphPromise('region.rebootInstances', () => {
        return request
        .post(`${config.services.compost}`)
        .query({type: AWS_REBOOT_INSTANCES})
        .set('Authorization', state().user.get('auth'))
        .send({
          query: `mutation reboot($region: String!, $ids: [String]!){
            region(id: $region) {
              rebootInstances(ids: $ids)
            }
          }`,
          variables: _.assign(_.pick(state().env, ['region']), {ids})
        });
      })
    });
  };
}

export function stopInstances(ids = []){
  return (dispatch, state) => {
    dispatch({
      type: AWS_STOP_INSTANCES,
      payload: graphPromise('region.stopInstances', () => {
        return request
        .post(`${config.services.compost}`)
        .query({type: AWS_STOP_INSTANCES})
        .set('Authorization', state().user.get('auth'))
        .send({
          query: `mutation reboot($region: String!, $ids: [String]!){
            region(id: $region) {
              stopInstances(ids: $ids)
            }
          }`,
          variables: _.assign(_.pick(state().env, ['region']), {ids})
        });
      })
    });
  };
}

export function startInstances(ids = []){
  return (dispatch, state) => {
    dispatch({
      type: AWS_START_INSTANCES,
      payload: graphPromise('region.startInstances', () => {
        return request
        .post(`${config.services.compost}`)
        .query({type: AWS_START_INSTANCES})
        .set('Authorization', state().user.get('auth'))
        .send({
          query: `mutation reboot($region: String!, $ids: [String]!){
            region(id: $region) {
              startInstances(ids: $ids)
            }
          }`,
          variables: _.assign(_.pick(state().env, ['region']), {ids})
        });
      })
    });
  };
}

export const selectToggle = createAction(ENV_SELECT_TOGGLE);