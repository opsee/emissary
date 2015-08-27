import config from '../config';
import Flux from '../Flux';

// data storage
let _data = {
  instances:[
    {
      name:'a-q8r-309fo (US-West-1)',
      lastChecked:new Date(),
      info:'Fun info here.',
      id:'foo',
      status:{
        health:25,
        state:'running',
        silence:{
          startDate:null,
          duration:null
        }
      },
    },
    {
      name:'aefiljea-fae-fe (US-West-2)',
      lastChecked:new Date(),
      info:'Secondary info.',
      id:'foo-2',
      status:{
        health:25,
        state:'running',
        silence:{
          startDate:null,
          duration:null
        }
      },
    },
    {
      name:'popfaef-eefff-f (US-West-3)',
      lastChecked:new Date(),
      info:'Great info here.',
      id:'foo-3',
      status:{
        health:25,
        state:'running',
        silence:{
          startDate:null,
          duration:null
        }
      },
    },
  ],
  groups:[
    {
      id:'209490jgalkj',
      name:'foo group'
    },
    {
      id:'234oijaligrhglkj',
      name:'fee!'
    }
  ]
}

function addItem(title, completed=false) {
  _data.push({title, completed});
}

function clear(){
  _data = [];
}

const Store = Flux.createStore(
  {
    getInstances(){
      return _data.instances;
    },
    getGroups(){
      return _data.groups;
    },
  }, function(payload){
    switch(payload.actionType) {
      case 'GET_INSTANCES_SUCCESS':
        _data.instances = payload.data;
      break;
    }
  }
)

export default Store;
