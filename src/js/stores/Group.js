import Flux from '../modules/flux';
import _ from 'lodash';
import Immutable, {Record, List} from 'immutable';
import InstanceStore from './Instance';

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
  checks: List()
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
  checks: List()
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
  getStateFromItem(item){
    let string = 'running';
    if (typeof item.health === 'number'){
      string = item.health === 100 ? 'passing' : 'failing';
    }
    return string;
  },
  getHealthFromItem(item){
    let health;
    if (item.checks && item.checks.length){
      const boolArray = item.checks.map(check => {
        return _.chain(check.assertions).pluck('passing').every().value();
      });
      health = Math.floor((_.compact(boolArray).length / boolArray.length) * 100);
    }
    return health;
  },
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
      d.type = 'security';
      return d;
    }).sortBy(d => {
      return d.GroupName.toLowerCase();
    }).value();
    _data.groupsSecurity = newData && newData.length ? Immutable.fromJS(newData.map(statics.groupFromJS)) : new List();
    Store.emitChange();
  },
  getGroupELBSuccess(data){
    _data.groupELB = statics.groupELBFromJS(data);
    Store.emitChange();
  },
  getGroupsELBSuccess(data){
    let newData = _.chain(data)
    .sortBy(d => {
      return d.LoadBalancerName.toLowerCase();
    }).value();
    _data.groupsELB = newData && newData.length ? Immutable.fromJS(newData.map(statics.groupELBFromJS)) : new List();
    Store.emitChange();
  },
  groupELBFromJS(data){
    let instances = data.instances || data.Instances;
    let newData = data;
    if (!instances){
      instances = InstanceStore.getInstancesECC().toJS().filter(instance => {
        return _.findWhere(instance.SecurityGroups, {GroupId: newData.LoadBalancerName});
      });
    }
    if (instances.length){
      if (instances[0].InstanceId){
        newData.instances = _.uniq(instances, 'InstanceId');
      }
      newData.instances = new List(newData.instances.map(instance => InstanceStore.instanceFromJS(instance)));
    }
    newData.name = newData.LoadBalancerName;
    newData.id = newData.LoadBalancerName;
    if (newData.name === 'api-lb'){
      newData.checks = [{
        assertions: [
          {passing: true}
        ]
      }];
    }
    if (newData.name === 'api-lb-com'){
      newData.checks = [
        {
          assertions: [
          {passing: false}
          ]
        },
        {
          assertions: [
          {passing: true},
          {passing: true}
          ]
        }
      ];
    }
    newData.health = statics.getHealthFromItem(newData);
    newData.state = statics.getStateFromItem(newData);
    return new GroupELB(newData);
  },
  groupFromJS(data){
    let instances = data.instances;
    let newData = data;
    if (!instances){
      instances = InstanceStore.getInstancesECC().toJS().filter(instance => {
        return _.findWhere(instance.SecurityGroups, {GroupId: newData.LoadBalancerName});
      });
    }
    if (instances.length){
      if (instances[0].InstanceId){
        newData.instances = _.uniq(instances, 'InstanceId');
      }
      newData.instances = new List(newData.instances.map(instance => InstanceStore.instanceFromJS(instance)));
    }
    //TODO - make sure status starts working when coming from api, have to code it like meta below
    newData.meta = Immutable.fromJS(newData.meta);
    newData.id = newData.GroupId;
    newData.name = newData.GroupName;
    if (newData.name === 'api-lb'){
      newData.checks = [
        {
          assertions: [
          {passing: false},
          {passing: false}
          ]
        },
        {
          assertions: [
          {passing: true},
          {passing: true},
          {passing: false}
          ]
        },
        {
          assertions: [
          {passing: true},
          {passing: true},
          {passing: true}
          ]
        }
      ];
    }
    newData.health = statics.getHealthFromItem(newData);
    newData.state = statics.getStateFromItem(newData);
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
      switch (target.type){
      case 'elb':
        return _public.getGroupsELB().filter(group => group.get('id') === target.id).get(0);
      default:
        return _public.getGroupsSecurity().filter(group => group.get('id') === target.id).get(0);
      }
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