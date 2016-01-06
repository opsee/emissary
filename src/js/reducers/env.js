import _ from 'lodash';
import {fromJS, List} from 'immutable';
import result from '../modules/result';
// import exampleGroupsElb from '../examples/groupsElb';
import {handleActions} from 'redux-actions';
import {InstanceEcc, InstanceRds, GroupSecurity, GroupElb} from '../modules/schemas';
import {
  ENV_SET_SEARCH,
  ENV_GET_BASTIONS,
  GET_GROUP_SECURITY,
  GET_GROUPS_SECURITY,
  GET_GROUP_ELB,
  GET_GROUPS_ELB,
  GET_INSTANCE_ECC,
  GET_INSTANCES_ECC,
  GET_INSTANCE_RDS,
  GET_INSTANCES_RDS
} from '../actions/constants';

/* eslint-disable no-use-before-define */

const statics = {
  getGroupSecuritySuccess(state, data){
    const arr = state.groups.security;
    const single = statics.groupSecurityFromJS(state, data);
    const index = arr.findIndex(item => {
      return item.get('id') === single.get('id');
    });
    if (index > -1){
      return arr.update(index, () => single);
    }
    return arr.concat(new List([single]));
  },
  getGroupsSecuritySuccess(state, data){
    let newData = _.chain(data).map(d => {
      d.group.type = 'security';
      return d;
    }).sortBy(d => {
      return d.group.GroupName.toLowerCase();
    }).value();
    const changed = newData && newData.length ? fromJS(newData.map(g => {
      return statics.groupSecurityFromJS(state, g);
    })) : new List();
    return changed;
  },
  getGroupElbSuccess(state, data){
    const arr = state.groups.elb;
    const single = statics.groupElbFromJS(state, data);
    const index = arr.findIndex(item => {
      return item.get('id') === single.get('id');
    });
    if (index > -1){
      return arr.update(index, () => single);
    }
    return arr.concat(new List([single]));
  },
  getGroupsElbSuccess(state, data){
    let newData = _.chain(data)
    .sortBy(d => {
      return d.group.LoadBalancerName.toLowerCase();
    }).value();
    const changed = newData && newData.length ? fromJS(newData.map(g => {
      return statics.groupElbFromJS(state, g);
    })) : new List();
    return changed;
  },
  groupElbFromJS(state, data){
    let newData = data.group || data;
    newData.instance_count = data.instance_count;
    if (Array.isArray(newData.Instances)){
      newData.instances = new List(_.pluck(newData.Instances, 'InstanceId'));
    }else {
      newData.instances = new List();
    }
    newData.name = newData.LoadBalancerName;
    newData.id = newData.LoadBalancerName;
    _.assign(newData, result.getFormattedData(data));
    newData.checks = new List(newData.checks);
    if (newData.checks.size && !newData.results.size){
      newData.state = 'initializing';
    }
    return new GroupElb(newData);
  },
  groupSecurityFromJS(state, data){
    let newData = data.group || data;
    newData.instance_count = data.instance_count;
    // let instances = data.instances;
    // if (!instances){
    //   instances = state.instances.ecc.toJS().filter(instance => {
    //     return _.findWhere(instance.SecurityGroups, {GroupId: newData.LoadBalancerName});
    //   });
    // }
    // if (instances.size){
    //   instances = instances.toJS();
    // }
    // if (instances.length){
    //   newData.instances = new List(instances.map(instance => {
    //     const results = instance.results;
    //     return statics.instanceEccFromJS({instance, results});
    //   }));
    // }
    newData.meta = fromJS(newData.meta);
    newData.id = newData.GroupId;
    newData.name = newData.GroupName;
    _.assign(newData, result.getFormattedData(data));
    newData.checks = new List(newData.checks);
    if (newData.checks.size && !newData.results.size){
      newData.state = 'initializing';
    }
    return new GroupSecurity(newData);
  },
  getInstanceEccSuccess(state, data){
    const arr = state.instances.ecc;
    const single = statics.instanceEccFromJS(data);
    const index = arr.findIndex(item => {
      return item.get('id') === single.get('id');
    });
    if (index > -1){
      return arr.update(index, () => single);
    }
    return arr.concat(new List([single]));
  },
  getInstancesEccSuccess(state, data){
    let newData = _.chain(data)
    .map(statics.instanceEccFromJS)
    .sortBy(i => {
      return i.name.toLowerCase();
    }).value();
    return newData && newData.length ? fromJS(newData) : List();
  },
  getInstanceRdsSuccess(state, data){
    const arr = state.instances.rds;
    const single = statics.instanceRdsFromJS(data);
    const index = arr.findIndex(item => {
      return item.get('id') === single.get('id');
    });
    if (index > -1){
      return arr.update(index, () => single);
    }
    return arr.concat(new List([single]));
  },
  getInstancesRdsSuccess(state, data){
    let newData = _.chain(data)
    .map(statics.instanceRdsFromJS)
    .sortBy(i => {
      return i.name.toLowerCase();
    }).value();
    return newData && newData.length ? fromJS(newData) : List();
  },
  getCreatedTime(time){
    let launchTime;
    const parsed = Date.parse(time);
    if (typeof parsed === 'number' && !_.isNaN(parsed) && parsed > 0){
      launchTime = parsed;
    }
    return launchTime;
  },
  instanceRdsFromJS(raw){
    let data = raw.instance;
    let newData = data.instance ? _.cloneDeep(data.instance) : _.cloneDeep(data);
    if (!newData.results){
      newData.results = raw.results || data.results;
    }
    newData.id = newData.DBInstanceIdentifier;
    newData.name = `${newData.DBName} - ${newData.id}`;
    newData.LaunchTime = statics.getCreatedTime(newData.InstanceCreateTime);
    newData.type = 'RDS';
    newData.VpcSecurityGroups = new List(newData.VpcSecurityGroups.map(g => fromJS(g)));
    _.assign(newData, result.getFormattedData(newData));
    if (newData.checks && newData.checks.size && !newData.results.size){
      newData.state = 'initializing';
    }
    newData.meta = fromJS(newData.meta);
    return new InstanceRds(newData);
  },
  instanceEccFromJS(raw){
    let data = raw.instance;
    let newData = data.instance ? _.cloneDeep(data.instance) : _.cloneDeep(data);
    if (!newData.results){
      newData.results = raw.results || data.results;
    }
    newData.id = newData.InstanceId;
    let name = newData.id;
    if (newData.Tags && newData.Tags.length){
      name = _.chain(newData.Tags).findWhere({Key: 'Name'}).get('Value').value() || name;
    }
    newData.SecurityGroups = new List(newData.SecurityGroups.map(g => fromJS(g)));
    newData.Placement = fromJS(newData.Placement);
    newData.name = name;
    newData.LaunchTime = statics.getCreatedTime(newData.LaunchTime);
    newData.type = 'EC2';
    _.assign(newData, result.getFormattedData(newData));
    if (newData.checks && newData.checks.size && !newData.results.size){
      newData.state = 'initializing';
    }
    //TODO - make sure status starts working when coming from api, have to code it like meta below
    newData.meta = fromJS(newData.meta);
    return new InstanceEcc(newData);
  }
};

const initial = {
  groups: {
    security: new List(),
    rds: new List(),
    elb: new List()
  },
  instances: {
    ecc: new List(),
    rds: new List()
  },
  search: null,
  bastions: []
};

export default handleActions({
  [ENV_SET_SEARCH]: {
    next(state, action){
      return _.assign({}, state, {search: action.payload});
    }
  },
  [GET_GROUP_SECURITY]: {
    next(state, action){
      const security = statics.getGroupSecuritySuccess(state, action.payload);
      const data = _.assign({}, state.groups, {security});
      return _.assign({}, state, {groups: data});
    }
  },
  [GET_GROUPS_SECURITY]: {
    next(state, action){
      const security = statics.getGroupsSecuritySuccess(state, action.payload);
      const data = _.assign({}, state.groups, {security});
      return _.assign({}, state, {groups: data});
    }
  },
  [GET_GROUP_ELB]: {
    next(state, action){
      const elb = statics.getGroupElbSuccess(state, action.payload);
      const data = _.assign({}, state.groups, {elb});
      return _.assign({}, state, {groups: data});
    }
  },
  [GET_GROUPS_ELB]: {
    next(state, action){
      const elb = statics.getGroupsElbSuccess(state, action.payload);
      const data = _.assign({}, state.groups, {elb});
      return _.assign({}, state, {groups: data});
    }
  },
  [GET_INSTANCE_ECC]: {
    next(state, action){
      const ecc = statics.getInstanceEccSuccess(state, action.payload);
      const data = _.assign({}, state.instances, {ecc});
      return _.assign({}, state, {instances: data});
    }
  },
  [GET_INSTANCES_ECC]: {
    next(state, action){
      const ecc = statics.getInstancesEccSuccess(state, action.payload);
      const data = _.assign({}, state.instances, {ecc});
      return _.assign({}, state, {instances: data});
    }
  },
  [GET_INSTANCE_RDS]: {
    next(state, action){
      const rds = statics.getInstanceRdsSuccess(state, action.payload);
      const data = _.assign({}, state.instances, {rds});
      return _.assign({}, state, {instances: data});
    }
  },
  [GET_INSTANCES_RDS]: {
    next(state, action){
      const rds = statics.getInstancesRdsSuccess(state, action.payload);
      const data = _.assign({}, state.instances, {rds});
      return _.assign({}, state, {instances: data});
    }
  },
  [ENV_GET_BASTIONS]: {
    next(state, action){
      return _.assign({}, state, {bastions: action.payload});
    }
  }
}, initial);