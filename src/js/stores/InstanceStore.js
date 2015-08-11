import Constants from '../Constants';
import Flux from '../Flux';
import _ from 'lodash';
import moment from 'moment';
import Immutable, {Record, List, Map} from 'immutable';
import GroupStore from './GroupStore';

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

let _instances = List();
let _instance = new Instance();

const statics = {
  getInstanceSuccess(data){
    _instance = statics.instanceFromJS(data);
  },
  getInstancesSuccess(data){
    _instances = Immutable.fromJS(data.map(statics.instanceFromJS));
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

const Store = Flux.createStore(
  {
    getInstance(){
      return _instance;
    },
    getInstances(){
      return _instances;
    },
    instanceFromJS:statics.instanceFromJS
  }, function(payload){
    switch(payload.actionType) {
      case 'GET_INSTANCES_SUCCESS':
        statics.getInstancesSuccess(payload.data);
        Store.emitChange();
      break;
      case 'GET_INSTANCE_SUCCESS':
        statics.getInstanceSuccess(payload.data);
        Store.emitChange();
      break;
      case 'GET_INSTANCE_PENDING':
        if(_instance.get('id') != payload.data){
          _instance = new Instance();
          Store.emitChange();
        }
      break;
    }
  }
)

export default Store;