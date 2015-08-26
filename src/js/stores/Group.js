import config from '../config';
import Flux from '../Flux';
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

let _group = new Group();
let _groups = new List();

const statics = {
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

let _statuses = {
  getGroups:null,
  getGroup:null
}

const Store = Flux.createStore(
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
        _groups = payload.data && payload.data.length ? Immutable.fromJS(payload.data.map(statics.groupFromJS)) : [];
      break;
      case 'GET_GROUP_SUCCESS':
        _group = statics.groupFromJS(payload.data)
      break;
      case 'GET_GROUP_PENDING':
        if(_group.get('id') != payload.data){
          _group = new Group();
        }
      break;
    }
    _statuses = Flux.statics.statusProcessor(payload, _statuses);
    Store.emitChange();
  }
)

export default Store;