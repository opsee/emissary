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
  status:Map({
    health:100,
    state:'running',
    silence:Map({
      startDate:null,
      duration:null
    })
  }),
  checks:List(),
  groups:List()
})

const statics = {
  getInstanceSuccess(data){
    _data.instance = statics.instanceFromJS(data);
    Store.emitChange();
  },
  getInstancePending(data){
    if(_data.instance.get('id') != data){
      _data.instance = new Instance();
      Store.emitChange();
    }
  },
  getInstancesSuccess(data){
    _data.instances = data && data.length ? Immutable.fromJS(data.map(statics.instanceFromJS)) : [];
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
    //TODO - make sure status starts working when coming from api, have to code it like meta below
    data.meta = Immutable.fromJS(data.meta);
    return new Instance(data);
  }
}

let _data = {
  instances:new List(),
  instance:new Instance()
}

let _statuses = {
  getInstances:null,
  getInstance:null
}

const Store = Flux.createStore(
  {
    getInstance(){
      return _data.instance;
    },
    getInstances(){
      return _data.instances;
    },
    instanceFromJS:statics.instanceFromJS
  }, function(payload){
    switch(payload.actionType) {
      case 'GET_data.INSTANCES_SUCCESS':
        statics.getInstancesSuccess(payload.data);
      break;
      case 'GET_data.INSTANCE_SUCCESS':
        statics.getInstanceSuccess(payload.data);
      break;
      case 'GET_data.INSTANCE_PENDING':
        statics.getInstancePending(payload.data);
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