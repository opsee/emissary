import config from '../modules/config';
import Flux from '../modules/flux';
import _ from 'lodash';
import Immutable, {Record, List, Map} from 'immutable';
import GroupStore from './Group';

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
  checks: List()
});

let _data = {
  instanceECC: new Instance(),
  instancesECC: new List(),
  instanceRDS: new Instance(),
  instancesRDS: new List()
};

const statics = {
  getStateFromItem(item){
    const checks = item.checks;
    let string = 'running';
    if (checks && checks.length){
      const allPassing = _.chain(checks).pluck('assertions').pluck('passing').every().value();
      string = allPassing ? 'passing' : 'failing';
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
    .uniq('InstanceId')
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
    }else {
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
    if (data.DBInstanceIdentifier){
      return statics.instanceRDSFromJS(data);
    }
    data.id = data.InstanceId;
    let name = data.id;
    if (data.Tags && data.Tags.length){
      name = _.chain(data.Tags).findWhere({Key: 'Name'}).get('Value').value() || name;
    }
    data.name = name;
    data.LaunchTime = statics.getCreatedTime(data.LaunchTime);
    data.type = 'EC2';
    if (data.name === 'coreos4'){
      data.checks = [
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
    if (data.name === 'IRC'){
      data.checks = [
        {
          assertions: [
            {passing: true},
            {passing: true}
          ]
        }
      ];
    }
    data.health = statics.getHealthFromItem(data);
    data.state = statics.getStateFromItem(data);
    if (data.SecurityGroups && data.SecurityGroups.length){
      data.groups = new List(data.SecurityGroups.map(group => GroupStore.groupFromJS(group)));
    }
    //TODO - make sure status starts working when coming from api, have to code it like meta below
    data.meta = Immutable.fromJS(data.meta);
    return new Instance(data);
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