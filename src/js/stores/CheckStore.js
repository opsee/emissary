import Constants from '../Constants';
import Flux from '../Flux';
import _ from 'lodash';
import moment from 'moment';
import Immutable from 'immutable';

// data storage
let _check = Immutable.fromJS({
  name:'My great check2',
  info:'Fun info here2.',
  id:'foo',
  method:'POST',
  path:'/foodog',
  port:8080,
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
  group:'group-1',
  headers:[
    {
      'key':'testkey',
      'value':'testvalue'
    },
    {
      'key':'testkey222',
      'value':'testvalue2222'
    },
    {
      'key':'testkey3333',
      'value':'testvalue3333'
    }
  ],
  assertions:[
    {
      type:'statusCode',
      relationship:'equal',
      operand:200
    },
    {
      type:'statusCode',
      relationship:'equal',
      operand:401
    }
  ],
  interval:'15m',
  message:'This is a great message',
  notifications:[
    {
     channel:'email',
     value:'great@mygreatthing.com' 
    }
  ],
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

let _response = Immutable.fromJS(
  {
    "data": [
      {
        "code": "100",
        "phrase": "Continue",
        "description": "\"indicates that the initial part of a request has been received and has not yet been rejected by the server $$$.\"",
      },
      {
        "code": "101",
        "phrase": "Switching Protocols",
        "description": "\"indicates that the server understands and is willing to comply with the client's request, via the Upgrade header field, for a change in the application protocol being used on this connection.\"",
      },
    ],
    "status": 200,
    "statusText": "OK",
    "headers": {
      "date": "Mon, 29 Jun 2015 17:49:21 GMT",
      "last-modified": "Tue, 16 Jun 2015 17:15:06 GMT",
      "content-type": "application/json",
      "cache-control": "public, max-age=0"
    }
  }
);

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
    newCheck(){
      return {
        name:null,
        info:null,
        id:null,
        method:null,
        path:null,
        port:null,
        meta:[],
        group:null,
        headers:[],
        assertions:[],
        interval:null,
        message:null,
        notifications:[],
        instances:[]
      }
    },
    getChecks(){
      return _checks;
    },
    getResponse(){
      return _response.toJS();
    },
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