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
  health:undefined,
  silenceDate:undefined,
  silenceDuration:undefined,
  type:'security',
  Description:undefined,
  checks:List()
});

var GroupELB = Record({
  id:undefined,
  name:undefined,
  instances:List(),
  state:'running',
  health:undefined,
  silenceDate:undefined,
  silenceDuration:undefined,
  type:'elb',
  Description:undefined,
  CreatedTime:undefined,
  checks:List()
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
  getStateFromItem(item){
    let string = 'running';
    if(typeof item.health == 'number'){
      string = item.health == 100 ? 'passing' : 'failing';
    }
    return string;
  },
  getHealthFromItem(item){
    let health;
    if(item.checks && item.checks.length){
      const boolArray = item.checks.map(check => {
        return _.chain(check.assertions).pluck('passing').every().value();
      });
      health = Math.floor((_.compact(boolArray).length / boolArray.length)*100);
    }
    return health;
  },
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
  getGroupELBSuccess(data){
    _data.groupELB = statics.groupELBFromJS(data);
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
    let instances = data.instances;
    if(!instances){
      instances = InstanceStore.getInstancesECC().toJS().filter(instance => {
        return _.findWhere(instance.SecurityGroups, {GroupId:data.LoadBalancerName})
      });
    }
    if(instances.length){
      if(instances[0].InstanceId){
        data.instances = _.uniq(instances, 'InstanceId');
      }
      data.instances = new List(data.instances.map(instance => InstanceStore.instanceFromJS(instance)));
    }
    data.name = data.LoadBalancerName;
    data.id = data.LoadBalancerName;
    if(data.name == 'api-lb'){
      data.checks = [{
        assertions:[
          {passing:true}
        ]
      }]
    }
    if(data.name == 'api-lb-com'){
      data.checks = [
      {
        assertions:[
          {passing:false}
        ]
      },
      {
        assertions:[
          {passing:true},
          {passing:true},
        ]
      },
      ]
    }
    data.health = statics.getHealthFromItem(data);
    data.state = statics.getStateFromItem(data);
    return new GroupELB(data);
  },
  groupFromJS(data){
    let instances = data.instances;
    if(!instances){
      instances = InstanceStore.getInstancesECC().toJS().filter(instance => {
        return _.findWhere(instance.SecurityGroups, {GroupId:data.LoadBalancerName})
      });
    }
    if(instances.length){
      if(instances[0].InstanceId){
        data.instances = _.uniq(instances, 'InstanceId');
      }
      data.instances = new List(data.instances.map(instance => InstanceStore.instanceFromJS(instance)));
    }
    //TODO - make sure status starts working when coming from api, have to code it like meta below
    data.meta = Immutable.fromJS(data.meta);
    data.id = data.GroupId;
    data.name = data.GroupName;
    if(data.name == 'api-lb'){
      data.checks = [
      {
        assertions:[
          {passing:false},
          {passing:false}
        ]
      },
      {
        assertions:[
          {passing:true},
          {passing:true},
          {passing:false}
        ]
      },
      {
        assertions:[
          {passing:true},
          {passing:true},
          {passing:true}
        ]
      },
      ]
    }
    data.health = statics.getHealthFromItem(data);
    data.state = statics.getStateFromItem(data);
    return new Group(data);
  },
  populateGroupInstances(){
    let groupsSecurity = _data.groupsSecurity;
    _data.groupsSecurity = groupsSecurity.map(sg => {
      const instances = InstanceStore.getInstancesECC().filter(instance => {
        return _.findWhere(instance.SecurityGroups, {GroupId:sg.id})
      });
      const newSg = sg.set('instances', new List(instances));
      return newSg;
    })
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
  getNewGroup(){
    return new Group();
  },
  getGroupsELB(){
    return _data.groupsELB;
  },
  getGroup(target){
    if(target && target.type){
      switch(target.type){
        case 'security':
          return _data.groupSecurity; 
        break;
        case 'elb':
          return _data.groupELB;
        break;
      }
    }
    return _data.groupSecurity;
  },
  getGroupFromFilter(target){
    if(target && target.id){
      switch(target.type){
        case 'elb':
          return _public.getGroupsELB().filter(group => group.get('id') == target.id).get(0);
        break;
        default:
          return _public.getGroupsSecurity().filter(group => group.get('id') == target.id).get(0);
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
    }
    const statusData = Flux.statics.statusProcessor(payload, _statuses, Store);
    _statuses = statusData.statuses;
    if(statusData.haveChanged){
      Store.emitChange();
    }
  }
)

export default Store;