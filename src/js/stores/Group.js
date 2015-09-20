import config from '../modules/config';
import Flux from '../modules/flux';
import _ from 'lodash';
import moment from 'moment';
import Immutable, {Record, List, Map} from 'immutable';
import InstanceStore from './Instance';

var Group = Record({
  id:null,
  name:null,
  customer_id:null,
  instances:List(),
  state:'running',
  health:100,
  silenceDate:null,
  silenceDuration:null,
  type:'security',
  Description:null
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
  getGroupPending(data){
    if(_data.group.get('id') != data){
      _data.group = new Group();
    }
  },
  getGroupSecuritySuccess(data){
    data.type = 'security';
    _data.groupSecurity = statics.groupFromJS(data);
    Store.emitChange();
  },
  getGroupsSecuritySuccess(data){
    data = data.map(d => {
      d.type = 'security';
      return d;
    });
    _data.groupsSecurity = data && data.length ? Immutable.fromJS(data.map(statics.groupFromJS)) : [];
    Store.emitChange();
  },
  groupFromJS(data){
    //just getting some id's back from server at the moment
    if(typeof data == 'string'){
      data = {id:data}
    }
    if(data.instances && data.instances.length){
      data.instances = new List(data.instances.map(instance => InstanceStore.instanceFromJS(instance)));
    }
    //TODO - make sure status starts working when coming from api, have to code it like meta below
    data.meta = Immutable.fromJS(data.meta);
    data.id = data.GroupId;
    data.name = data.GroupName;
    return new Group(data);
  }
}


const _public = {
  getGroupSecurity(){
    return _data.groupSecurity;
  },
  getGroupsSecurity(){
    return _data.groupsSecurity;
  },
  getGroupRDSSecurity(){
    return _data.groupRDSSecurity;
  },
  getGroupsRDSSecurity(){
    return _data.groupsRDSSecurity;
  },
  getGroupELB(){
    return _data.groupELB;
  },
  getGroupsELB(){
    return _data.groupsELB;
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
      case 'GET_GROUP_PENDING':
        statics.getGroupPending(payload.data);
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