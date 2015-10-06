import config from '../modules/config';
import Flux from '../modules/flux';
import _ from 'lodash';
import moment from 'moment';
import Immutable, {Record, List, Map} from 'immutable';
import InstanceStore from './Instance';

var Group = Record({
  id:undefined,
  name:undefined,
  customer_id:undefined,
  instances:List(),
  state:'running',
  health:100,
  silenceDate:undefined,
  silenceDuration:undefined,
  type:'security',
  Description:undefined
});

var GroupELB = Record({
  id:undefined,
  name:undefined,
  instances:List(),
  state:'running',
  health:100,
  silenceDate:undefined,
  silenceDuration:undefined,
  type:'elb',
  Description:undefined,
  CreatedTime:undefined
});

let _data = {
  groupSecurity:new Group(),
  groupsSecurity:new List(),
  groupRDSSecurity:new Group(),
  groupsRDSSecurity:new List(),
  groupELB:new Group(),
  groupsELB:new List(),
}

let _statuses = {
  getGroupsSecurity:null,
  getGroupSecurity:null,
  getGroupsRDSSecurity:null,
  getGroupRDSSecurity:null,
  getGroupsELB:null,
  getGroupELB:null
}

const statics = {
  getGroupSecurityPending(data){
    if(_data.groupSecurity.get('id') != data){
      _data.groupSecurity = new Group();
    }
  },
  getGroupSecuritySuccess(data){
    data.type = 'security';
    _data.groupSecurity = statics.groupFromJS(data);
    Store.emitChange();
  },
  getGroupsSecuritySuccess(data){
    data = _.chain(data).map(d => {
      d.type = 'security';
      return d;
    }).sortBy(d => {
      return d.GroupName.toLowerCase();
    }).value();
    _data.groupsSecurity = data && data.length ? Immutable.fromJS(data.map(statics.groupFromJS)) : new List();
    Store.emitChange();
  },
  getGroupsELBSuccess(data){
    data = _.chain(data)
    .sortBy(d => {
      return d.LoadBalancerName.toLowerCase();
    }).value();
    _data.groupsELB = data && data.length ? Immutable.fromJS(data.map(statics.groupELBFromJS)) : new List();
    Store.emitChange();
  },
  groupELBFromJS(data){
    if(data.Instances && data.Instances.length){
      if(data.Instances[0].InstanceId){
        data.instances = _.uniq(data.Instances, 'InstanceId');
      }
      data.instances = new List(data.instances.map(instance => InstanceStore.instanceFromJS(instance)));
    }
    data.id = data.LoadBalancerName;
    data.name = data.LoadBalancerName;
    if(data.name == 'c1-us-west-1' && config.error){
      data.health = 75;
    }
    return new GroupELB(data);
  },
  groupFromJS(data){
    if(data.instances && data.instances.length){
      if(data.instances[0].InstanceId){
        data.instances = _.uniq(data.instances, 'InstanceId');
      }
      data.instances = new List(data.instances.map(instance => InstanceStore.instanceFromJS(instance)));
    }
    //TODO - make sure status starts working when coming from api, have to code it like meta below
    data.meta = Immutable.fromJS(data.meta);
    data.id = data.GroupId;
    data.name = data.GroupName;
    if(data.name == 'c1-us-west-1' && config.error){
      data.health = 75;
    }
    return new Group(data);
  }
}


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
  getGroupsELB(){
    return _data.groupsELB;
  },
  getGroup(target){
    if(target && target.type){
      switch(target.type){
        case 'security':
          if(_data.groupSecurity && _data.groupSecurity.get('id')){
            return _data.groupSecurity;
          }else{
            return _public.getGroupsSecurity().filter(group => group.get('id') == target.id).get(0);
          }
        break;
        case 'elb':
          if(_data.groupELB && _data.groupELB.get('id')){
            return _data.groupELB;
          }else{
            return _public.getGroupsELB().filter(group => group.get('id') == target.id).get(0);
          }
        break;
      }
    }
    return _data.groupSecurity;
  },
  groupFromJS:statics.groupFromJS
}

let statusFunctions = {};
let keys = _.chain(_statuses).keys().map(k => {
  let arr = [k]
  arr.push('get'+_.startCase(k).split(' ').join('')+'Status');
  return arr;
}).forEach(a => {
  statusFunctions[a[1]] = function(){
    return _statuses[a[0]]
  }
}).value();

const Store = Flux.createStore(
   _.assign({}, _public, statusFunctions),
  function(payload){
    switch(payload.actionType) {
      case 'GET_GROUPS_SECURITY_SUCCESS':
        statics.getGroupsSecuritySuccess(payload.data);
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
    }
    const statusData = Flux.statics.statusProcessor(payload, _statuses, Store);
    _statuses = statusData.statuses;
    if(statusData.haveChanged){
      Store.emitChange();
    }
  }
)

export default Store;