import config from '../modules/config';
import Flux from '../modules/flux';
import _ from 'lodash';
import moment from 'moment';
import Immutable, {Record, List, Map} from 'immutable';
import GroupStore from './Group';

// data storage
let _testInstance = {
  name:'a-q8r-309fo (US-West-1)',
  lastChecked:new Date(),
  info:'Fun info here.',
  id:'foo',
  meta:{
    created:new Date(),
    instanceSize:'t2-micro'
  },
  status:{
    health:25,
    state:'running',
    silence:{
      startDate:null,
      duration:null
    }
  },
  checks:[
  ],
  groups:[
  ]
}

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
  type:null,
  checks:List(),
  groups:List(),
  LaunchTime:null,
  InstanceType:null
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
    if(data && data.instances){
      data = data.instances;
      data.type = 'EC2';
      _data.instanceECC = statics.instanceFromJS(data);
      Store.emitChange();
    }
  },
  getInstancesECCSuccess(data){
    data = data.map(i => {
      i.type = 'EC2';
      return i;
    });
    _data.instancesECC = data && data.length ? Immutable.fromJS(data.map(statics.instanceFromJS)) : [];
    Store.emitChange();
  },
  instanceFromJS(data){
    //just getting some id's back from server at the moment
    if(typeof data == 'string'){
      data = {id:data}
    }
    if(data.groups && data.groups.length){
      data.groups = new List(data.groups.map(group => GroupStore.groupFromJS(group)));
    }
    data.id = data.InstanceId;
    let name = data.id;
    if(data.Tags && data.Tags.length){
      name = _.chain(data.Tags).findWhere({Key:'Name'}).get('Value').value() || name;
    }
    data.name = name;
    const launchTime = Date.parse(data.LaunchTime);
    if(typeof launchTime == 'number' && !_.isNaN(launchTime) && launchTime > 0){
      data.LaunchTime = new Date(launchTime);
    }else{
      data.LaunchTime = null;
    }
    //TODO - make sure status starts working when coming from api, have to code it like meta below
    data.meta = Immutable.fromJS(data.meta);
    return new Instance(data);
  }
}

const _public = {
  getInstanceECC(){
    return _data.instanceECC;
  },
  getInstancesECC(){
    return _data.instancesECC;
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
    }
    const statusData = Flux.statics.statusProcessor(payload, _statuses, Store);
    _statuses = statusData.statuses;
    if(statusData.haveChanged){
      Store.emitChange();
    }
  }
)

export default Store;