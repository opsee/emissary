import Constants from '../Constants';
import Flux from '../Flux';
import _ from 'lodash';
import moment from 'moment';
import Immutable, {Record, List, Map} from 'immutable';
import InstanceStore from './InstanceStore';

var Group = Record({
  id:null,
  name:null,
  customer_id:null,
  instances:new List(),
  status:Map({
  health:100,
  state:'running',
  silence:Map({
    startDate:null,
    duration:null
    })
  })
});

let _group = new Group();
let _groups = List();

const statics = {
  getGroupSuccess(data){
    _group = statics.groupFromJS(data)
  },
  getGroupsSuccess(data){
    _groups = Immutable.fromJS(data.map(statics.groupFromJS));
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

const GroupStore = Flux.createStore(
  {
    getGroup(){
      return _group;
    },
    getGroups(){
      return _groups;
    },
    groupFromJS:statics.groupFromJS
  }, function(payload){
    switch(payload.actionType) {
      case 'GET_GROUPS_SUCCESS':
        statics.getGroupsSuccess(payload.data);
        GroupStore.emitChange();
      break;
      case 'GET_GROUP_SUCCESS':
        statics.getGroupSuccess(payload.data);
        GroupStore.emitChange();
      break;
      case 'GET_GROUP_PENDING':
        if(_group.get('id') != payload.data){
          _group = new Group();
          GroupStore.emitChange();
        }
      break;
    }
  }
)

export default GroupStore;