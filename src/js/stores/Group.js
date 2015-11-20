import Flux from '../modules/flux';
import _ from 'lodash';
import Immutable, {Record, List} from 'immutable';
import InstanceStore from './Instance';
import result from '../modules/result';
import exampleGroupsElb from '../examples/groupsElb';

/* eslint-disable no-use-before-define */

const Group = Record({
  id: undefined,
  name: undefined,
  customer_id: undefined,
  instances: List(),
  state: 'running',
  health: undefined,
  silenceDate: undefined,
  silenceDuration: undefined,
  type: 'security',
  Description: undefined,
  checks: List(),
  instance_count: undefined,
  results: List(),
  passing: 0,
  total: 0
});

const GroupELB = Record({
  id: undefined,
  name: undefined,
  instances: List(),
  state: 'running',
  health: undefined,
  silenceDate: undefined,
  silenceDuration: undefined,
  type: 'elb',
  Description: undefined,
  CreatedTime: undefined,
  checks: List(),
  instance_count: undefined,
  results: List(),
  passing: 0,
  total: 0,
  lastChecked: undefined
});

let _data = {
  groupSecurity: new Group(),
  groupsSecurity: new List(),
  groupRDSSecurity: new Group(),
  groupsRDSSecurity: new List(),
  groupELB: new Group(),
  groupsELB: new List()
};

const statics = {
  getGroupSecurityPending(data){
    if (_data.groupSecurity.get('id') !== data){
      _data.groupSecurity = new Group();
    }
  },
  getGroupSecuritySuccess(data){
    data.type = 'security';
    _data.groupSecurity = statics.groupFromJS(data);
    Store.emitChange();
  },
  getGroupsSecuritySuccess(data){
    let newData = _.chain(data).map(d => {
      d.group.type = 'security';
      return d;
    }).sortBy(d => {
      return d.group.GroupName.toLowerCase();
    }).value();
    const changed = newData && newData.length ? Immutable.fromJS(newData.map(statics.groupFromJS)) : new List();
    if (!Immutable.is(_data.groupsELB, changed)){
      _data.groupsSecurity = changed;
      Store.emitChange();
    }
  },
  getGroupELBSuccess(data){
    _data.groupELB = statics.groupELBFromJS(data);
    Store.emitChange();
  },
  getGroupsELBSuccess(data){
    let newData = _.chain(data)
    .sortBy(d => {
      return d.group.LoadBalancerName.toLowerCase();
    }).value();
    const changed = newData && newData.length ? Immutable.fromJS(newData.map(statics.groupELBFromJS)) : new List();
    if (!Immutable.is(_data.groupsELB, changed)){
      _data.groupsELB = changed;
      Store.emitChange();
    }
  },
  groupELBFromJS(data){
    let newData = data.group || data;
    let instances = data.instances || data.Instances || newData.instances || newData.Instances;
    newData.instance_count = data.instance_count;
    if (!instances){
      instances = InstanceStore.getInstancesECC().toJS().filter(instance => {
        return _.findWhere(instance.SecurityGroups, {GroupId: newData.LoadBalancerName});
      });
    }
    if (instances.length){
      newData.instances = new List(instances.map(instance => {
        const results = instance.results;
        return InstanceStore.instanceFromJS({instance, results});
      }));
    }
    newData.name = newData.LoadBalancerName;
    newData.id = newData.LoadBalancerName;
    _.assign(newData, result.getFormattedData(data));
    newData.checks = new List(newData.checks);
    // newData.checks = CheckStore.getChecks().filter(check => {
    //   return check.target.id === newData.id;
    // });
    if (newData.checks.size && !newData.results.size){
      newData.state = 'initializing';
    }
    // if (newData.name === 'api-lb'){
    //   newData.checks = [{
    //     assertions: [
    //       {passing: true}
    //     ]
    //   }];
    // }
    return new GroupELB(newData);
  },
  groupFromJS(data){
    let instances = data.instances;
    let newData = data.group || data;
    newData.instance_count = data.instance_count;
    if (!instances){
      instances = InstanceStore.getInstancesECC().toJS().filter(instance => {
        return _.findWhere(instance.SecurityGroups, {GroupId: newData.LoadBalancerName});
      });
    }
    if (instances.length){
      newData.instances = new List(instances.map(instance => {
        const results = instance.results;
        return InstanceStore.instanceFromJS({instance, results});
      }));
    }
    //TODO - make sure status starts working when coming from api, have to code it like meta below
    newData.meta = Immutable.fromJS(newData.meta);
    newData.id = newData.GroupId;
    newData.name = newData.GroupName;
    _.assign(newData, result.getFormattedData(data));
    newData.checks = new List(newData.checks);
    if (newData.checks.size && !newData.results.size){
      newData.state = 'initializing';
    }
    return new Group(newData);
  },
  populateGroupInstances(){
    let groupsSecurity = _data.groupsSecurity;
    _data.groupsSecurity = groupsSecurity.map(sg => {
      const instances = InstanceStore.getInstancesECC().filter(instance => {
        return _.findWhere(instance.SecurityGroups, {GroupId: sg.id});
      });
      const newSg = sg.set('instances', new List(instances));
      return newSg;
    });
  },
  _statuses: {
    getGroupsSecurity: null,
    getGroupSecurity: null,
    getGroupsRDSSecurity: null,
    getGroupRDSSecurity: null,
    getGroupsELB: null,
    getGroupELB: null
  }
};

const _public = {
  getGroupsSecurity(){
    return _data.groupsSecurity;
  },
  getGroupRDSSecurity(){
    return _data.groupRDSSecurity;
  },
  getGroupsRDSSecurity(){
    return _data.groupsRDSSecurity;
  },
  getNewGroup(){
    return new Group();
  },
  getGroupsELB(){
    return _data.groupsELB;
  },
  getExampleGroupsElb(){
    let newData = _.chain(exampleGroupsElb.groups)
    .sortBy(d => {
      return d.group.LoadBalancerName.toLowerCase();
    }).value();
    return newData && newData.length ? Immutable.fromJS(newData.map(statics.groupELBFromJS)) : new List();
  },
  getGroup(target){
    if (target && target.type){
      switch (target.type){
      case 'security':
        return _data.groupSecurity;
      case 'elb':
        return _data.groupELB;
      default:
        break;
      }
    }
    return _data.groupSecurity;
  },
  getGroupFromFilter(target){
    if (target && target.id){
      const elb = _public.getGroupsELB().filter(group => group.get('id') === target.id);
      if (elb.size){
        return elb.get(0);
      }
      return _public.getGroupsSecurity().filter(group => group.get('id') === target.id).get(0);
    }
    return _data.groupSecurity;
  },
  groupFromJS: statics.groupFromJS
};

const statusFunctions = Flux.statics.generateStatusFunctions(statics);

const Store = Flux.createStore(
   _.assign({}, _public, statusFunctions),
  function handlePayload(payload){
    switch (payload.actionType) {
    case 'GET_GROUPS_SECURITY_SUCCESS':
      statics.getGroupsSecuritySuccess(payload.data);
      statics.populateGroupInstances();
      break;
    case 'GET_GROUP_SECURITY_SUCCESS':
      statics.getGroupSecuritySuccess(payload.data);
      break;
    case 'GET_GROUP_SECURITY_PENDING':
      statics.getGroupSecurityPending(payload.data);
      break;
    case 'GET_GROUPS_ELB_SUCCESS':
      statics.getGroupsELBSuccess(payload.data);
      break;
    case 'GET_GROUP_ELB_SUCCESS':
      statics.getGroupELBSuccess(payload.data);
      break;
    case 'GET_INSTANCES_ECC_SUCCESS':
      statics.populateGroupInstances();
      Store.emitChange();
      break;
    default:
      break;
    }
    const statusData = Flux.statics.statusProcessor(payload, statics, Store);
    statics._statuses = statusData.statuses;
    if (statusData.haveChanged){
      Store.emitChange();
    }
  }
);

export default Store;