import Constants from '../Constants';
import Flux from '../Flux';
import _ from 'lodash';
import moment from 'moment';
import Immutable from 'immutable';

// data storage
const _check = Immutable.fromJS({
  name:'My great check2',
  info:'Fun info here2.',
  id:'foo',
  port:80,
  meta:[
    {
      key:'State',
      value:'Failing'
    },
    {
      key:'Port',
      value:80
    },
    {
      key:'Protocol',
      value:'HTTP'
    }
  ],
  group:{
    name:'foogroup',
    id:'moogroup'
  },
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
      health:50,
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
      health:100,
      state:'running',
      silence:{
        startDate:null,
        duration:null
      }
    },
  },
  ]
});

let _checks = [
  {
    name:'My great check2',
    info:'Fun info here2.',
    id:'foo',
    status:{
      health:50,
      state:'running',
      silence:{
        startDate:null,
        duration:null
      }
    },
    meta:[
      {
        key:'State',
        value:'Failing'
      },
      {
        key:'Port',
        value:80
      },
      {
        key:'Protocol',
        value:'HTTP'
      }
    ],
  },
    {
    name:'My great check3333',
    info:'wow, great.',
    id:'great',
    status:{
      health:100,
      state:'running',
      silence:{
        startDate:null,
        duration:null
      }
    },
    meta:[
      {
        key:'State',
        value:'Failing'
      },
      {
        key:'Port',
        value:80
      },
      {
        key:'Protocol',
        value:'HTTP'
      }
    ],
  }
]

function setPort(port){
  _check.port = port;
}

function setSilence(opts){
  let check = _.findWhere(_checks, {id:opts.id});
    if(check){
      check.status.silence.startDate = new Date();
      check.status.silence.duration = moment.duration(opts.length, opts.unit).asMilliseconds();
    }
}

const CheckStore = Flux.createStore(
  {
    getCheck(){
      return _check.toJS();
    },
    getChecks(){
      return _checks;
    }
  }, function(payload){
    switch(payload.actionType) {
      case 'CHECK_SILENCE':
      setSilence(payload.text);
      CheckStore.emitChange();
      break;
      case 'CHECK_SET_PORT':
      setPort(payload.text);
      CheckStore.emitChange();
      break;
      // add more cases for other actionTypes...
    }
  }
)

export default CheckStore;