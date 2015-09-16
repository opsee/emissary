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
  status:Map({
  health:100,
  state:'running',
  silence:Map({
    startDate:null,
    duration:null
    })
  })
});

const statics = {
  getGroupSuccess(data){
    _data.group = statics.groupFromJS(data);
    Store.emitChange();
  },
  getGroupPending(data){
    if(_data.group.get('id') != data){
      _data.group = new Group();
    }
  },
  getGroupsSuccess(data){
    _data.groups = data && data.length ? Immutable.fromJS(data.map(statics.groupFromJS)) : [];
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
    return new Group(data);
  }
}

let _data = {
  group:new Group(),
  groups:new List()
}

let _statuses = {
  getGroups:null,
  getGroup:null
}

const Store = Flux.createStore(
  {
    getGroup(){
      return _data.group;
    },
    getGroups(){
      return _data.groups;
    },
    groupFromJS:statics.groupFromJS
  }, function(payload){
    switch(payload.actionType) {
      case 'GET_GROUPS_SUCCESS':
        statics.getGroupsSuccess(payload.data);
      break;
      case 'GET_GROUP_SUCCESS':
        statics.getGroupSuccess(payload.data);
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