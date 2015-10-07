import config from '../modules/config';
import Flux from '../modules/flux';
import _ from 'lodash';
import moment from 'moment';
import Immutable, {Record, List, Map} from 'immutable';
import GroupStore from './Group';

var Instance = Record({
  name:null,
  lastChecked:new Date(),
  info:null,
  id:null,
  meta:Map({
    created:new Date(),
    instanceSize:'t2-micro'
  }),
  state:'running',
  health:100,
  silenceDate:null,
  silenceDuration:null,
  type:'EC2',
  checks:List(),
  groups:List(),
  LaunchTime:null,
  InstanceType:null,
  Placement:null,
  SecurityGroups:List()
})


let _data = {
  instanceECC:new Instance(),
  instancesECC:new List(),
  instanceRDS:new Instance(),
  instancesRDS:new List(),
}

let _statuses = {
  getInstanceECC:null,
  getInstancesECC:null,
  getInstanceRDS:null,
  getInstancesRDS:null,
}

const statics = {
  getInstancePending(data){
    if(_data.instance.get('id') != data){
      _data.instance = new Instance();
      Store.emitChange();
    }
  },
  getInstanceECCSuccess(data){
    if(data && data.instance){
      data = data.instance;
      data.type = 'EC2';
      _data.instanceECC = statics.instanceFromJS(data);
      Store.emitChange();
    }
  },
  getInstancesECCSuccess(data){
    data = _.chain(data)
    .uniq('InstanceId')
    .map(statics.instanceFromJS)
    .sortBy(i => {
      return i.name.toLowerCase();
    }).value();
    _data.instancesECC = data && data.length ? Immutable.fromJS(data) : List();
    Store.emitChange();
  },
  getInstanceRDSSuccess(data){
    if(data && data.instances){
      data = data.instances;
      data.type = 'RDS';
      data.groups = data.SecurityGroups;
      _data.instanceRDS = statics.instanceRDSFromJS(data);
      Store.emitChange();
    }
  },
  getInstancesRDSSuccess(data){
    data = _.chain(data)
    .uniq('InstanceId')
    .map(statics.instanceRDSFromJS)
    .sortBy(i => {
      return i.name.toLowerCase();
    }).value();
    _data.instancesRDS = data && data.length ? Immutable.fromJS(data) : [];
    Store.emitChange();
  },
  getCreatedTime(time){
    let launchTime = Date.parse(time);
    if(typeof launchTime == 'number' && !_.isNaN(launchTime) && launchTime > 0){
    }else{
      launchTime = null;
    }
    return launchTime;
  },
  instanceRDSFromJS(data){
    data.id = data.DbiResourceId;
    data.name = data.DBName;
    data.LaunchTime = statics.getCreatedTime(data.InstanceCreateTime);
    data.type = 'RDS';
    return new Instance(data);
  },
  instanceFromJS(data){
    if(data.DBInstanceIdentifier){
      return statics.instanceRDSFromJS(data);
    }
    data.id = data.InstanceId;
    let name = data.id;
    if(data.Tags && data.Tags.length){
      name = _.chain(data.Tags).findWhere({Key:'Name'}).get('Value').value() || name;
    }
    data.name = name;
    data.LaunchTime = statics.getCreatedTime(data.LaunchTime);
    data.type = 'EC2';
    if(data.SecurityGroups && data.SecurityGroups.length){
      data.groups = new List(data.SecurityGroups.map(group => GroupStore.groupFromJS(group)));
    }
    if(data.name == 'coreos3' && config.error){
      data.health = 25;
      data.state = 'stopped';
    }
    //TODO - make sure status starts working when coming from api, have to code it like meta below
    data.meta = Immutable.fromJS(data.meta);
    return new Instance(data);
  },
  runInstanceAction(data){
    config.error = false;
    _data.instancesECC = _data.instancesECC.map(instance => {
      if(instance.get('id') == data.id){
        let changed = instance.toJS();
        changed.state = 'restarting';
        return Immutable.fromJS(changed);
      }
      return instance;
    });
  }
}

const _public = {
  getInstanceECC(){
    return _data.instanceECC;
  },
  getInstancesECC(groupId){
    if(groupId){
      return _data.instancesECC.filter(instance => {
        const groups = instance.get('groups');
        return _.findWhere(groups.toJS(), {id:groupId});
      })
    }
    return _data.instancesECC;
  },
  getInstanceRDS(){
    return _data.instanceRDS;
  },
  getInstancesRDS(){
    return _data.instancesRDS;
  },
  instanceFromJS:statics.instanceFromJS
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
      case 'GET_INSTANCES_ECC_SUCCESS':
        statics.getInstancesECCSuccess(payload.data);
      break;
      case 'GET_INSTANCE_ECC_SUCCESS':
        statics.getInstanceECCSuccess(payload.data);
      break;
      case 'GET_INSTANCE_ECC_PENDING':
        // statics.getInstancePending(payload.data);
      break;
      case 'RUN_INSTANCE_ACTION':
        statics.runInstanceAction(payload.data);
        config.error = false;
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