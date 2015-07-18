import Constants from '../Constants';
import Flux from '../Flux';
import _ from 'lodash';
import moment from 'moment';

// data storage
let _instance = {
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

const InstanceStore = Flux.createStore(
  {
    getInstance(){
      return _instance;
    }
  }, function(payload){
    switch(payload.actionType) {
      case 'TEST':
      InstanceStore.emitChange();
      break;
      // add more cases for other actionTypes...
    }
  }
)

export default InstanceStore;