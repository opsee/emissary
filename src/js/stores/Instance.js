import config from '../modules/config';
import Flux from '../modules/flux';
import _ from 'lodash';
import Immutable, {Record, List, Map} from 'immutable';
import GroupStore from './Group';
import result from '../modules/result';

/* eslint-disable no-use-before-define */

const Instance = Record({
  name: null,
  lastChecked: new Date(),
  info: null,
  id: null,
  meta: Map({
    created: new Date(),
    instanceSize: 't2-micro'
  }),
  state: 'running',
  health: undefined,
  silenceDate: null,
  silenceDuration: null,
  type: 'EC2',
  groups: List(),
  LaunchTime: null,
  InstanceType: null,
  Placement: null,
  SecurityGroups: List(),
  checks: List(),
  results: List(),
  passing: undefined,
  total: undefined
});

let _data = {
  instanceECC: new Instance(),
  instancesECC: new List(),
  instanceRDS: new Instance(),
  instancesRDS: new List()
};

const statics = {
  getInstancePending(data){
    if (_data.instance.get('id') !== data){
      _data.instance = new Instance();
      Store.emitChange();
    }
  },
  getInstanceECCSuccess(data){
    if (data && data.instance){
      let newData = data.instance;
      newData.type = 'EC2';
      _data.instanceECC = statics.instanceFromJS(newData);
      Store.emitChange();
    }
  },
  getInstancesECCSuccess(data){
    let newData = _.chain(data)
    .map(statics.instanceFromJS)
    .sortBy(i => {
      return i.name.toLowerCase();
    }).value();
    _data.instancesECC = newData && newData.length ? Immutable.fromJS(newData) : List();
    Store.emitChange();
  },
  getInstanceRDSSuccess(data){
    if (data && data.instances){
      let newData = data.instances;
      newData.type = 'RDS';
      newData.groups = newData.SecurityGroups;
      _data.instanceRDS = statics.instanceRDSFromJS(newData);
      Store.emitChange();
    }
  },
  getInstancesRDSSuccess(data){
    let newData = _.chain(data)
    .uniq('InstanceId')
    .map(statics.instanceRDSFromJS)
    .sortBy(i => {
      return i.name.toLowerCase();
    }).value();
    _data.instancesRDS = newData && newData.length ? Immutable.fromJS(newData) : [];
    Store.emitChange();
  },
  getCreatedTime(time){
    let launchTime;
    const parsed = Date.parse(time);
    if (typeof parsed === 'number' && !_.isNaN(parsed) && parsed > 0){
      launchTime = parsed;
    }
    return launchTime;
  },
  instanceRDSFromJS(data){
    let newData = data.instance || data;
    newData.id = newData.DbiResourceId;
    newData.name = newData.DBName;
    newData.LaunchTime = statics.getCreatedTime(newData.InstanceCreateTime);
    newData.type = 'RDS';
    return new Instance(newData);
  },
  instanceFromJS(data){
    if (data.DBInstanceIdentifier){
      return statics.instanceRDSFromJS(data);
    }
    let newData = data.instance || data;
    newData.id = newData.InstanceId;
    let name = newData.id;
    if (newData.Tags && newData.Tags.length){
      name = _.chain(newData.Tags).findWhere({Key: 'Name'}).get('Value').value() || name;
    }
    newData.name = name;
    newData.LaunchTime = statics.getCreatedTime(newData.LaunchTime);
    newData.type = 'EC2';
    _.assign(newData, result.getFormattedData(data));
    if (newData.SecurityGroups && newData.SecurityGroups.length){
      newData.groups = new List(newData.SecurityGroups.map(group => GroupStore.groupFromJS(group)));
    }
    //TODO - make sure status starts working when coming from api, have to code it like meta below
    newData.meta = Immutable.fromJS(newData.meta);
    return new Instance(newData);
  },
  runInstanceAction(data){
    _data.instancesECC = _data.instancesECC.map(instance => {
      if (instance.get('id') === data.id){
        let changed = instance.toJS();
        changed.state = 'restarting';
        return Immutable.fromJS(changed);
      }
      return instance;
    });
  },
  _statuses: {
    getInstanceECC: null,
    getInstancesECC: null,
    getInstanceRDS: null,
    getInstancesRDS: null
  }
};

const _public = {
  getInstanceECC(){
    return _data.instanceECC;
  },
  getInstanceFromFilter(target = {type: null, id: null}){
    return _public.getInstancesECC().filter(instance => instance.get('id') === target.id).get(0);
  },
  getInstancesECC(groupId){
    if (groupId){
      return _data.instancesECC.filter(instance => {
        const groups = instance.get('groups');
        return _.findWhere(groups.toJS(), {id: groupId});
      });
    }
    return _data.instancesECC;
  },
  getInstanceRDS(){
    return _data.instanceRDS;
  },
  getInstancesRDS(){
    return _data.instancesRDS;
  },
  instanceFromJS: statics.instanceFromJS
};

const statusFunctions = Flux.statics.generateStatusFunctions(statics);

const Store = Flux.createStore(
  _.assign({}, _public, statusFunctions),
  function handlePayload(payload){
    switch (payload.actionType) {
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