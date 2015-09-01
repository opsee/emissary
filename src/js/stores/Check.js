import config from '../modules/config';
import Flux from '../modules/flux';
import _ from 'lodash';
import moment from 'moment';
import Immutable, {Record, List, Map} from 'immutable';

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

let _checks = new List();

var Check = Record({
  name:null,
  info:null,
  id:null,
  method:null,
  path:null,
  port:null,
  meta:List(),
  group:null,
  headers:List(),
  assertions:List(),
  // interval:null,
  // message:null,
  notifications:List(),
  instances:List()
})

function setSilence(opts){
  let check = _checks.filter((c) => c.get('id') == opts.id).first();
  if(check){
    check.status.silence.startDate = new Date();
    check.status.silence.duration = moment.duration(opts.sizelength, opts.unit).asMilliseconds();
  }
}

const CheckStore = Flux.createStore(
  {
    getCheck(){
      return _check;
    },
    getChecks(){
      return _checks;
    },
    getResponse(){
      return _response.toJS();
    },
    newCheck(){
      return new Check();
    }
  }, function(payload){
    switch(payload.actionType) {
      case 'CHECK_CREATE_ERROR':
        console.error(payload.data);
      break;
    }
  }
)

export default CheckStore;