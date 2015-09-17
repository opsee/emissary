import config from '../modules/config';
import Flux from '../modules/flux';
import _ from 'lodash';
import moment from 'moment';
import Immutable, {Record, List, Map} from 'immutable';

// data storage
let _testCheck = Immutable.fromJS({
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
    health:25,
    state:'running',
    silenceDate:null,
    silenceDuration:null
  },
  {
    name:'aefiljea-fae-fe (US-West-2)',
    lastChecked:new Date(),
    info:'Secondary info.',
    id:'foo-2',
    health:45,
    state:'running',
    silenceDate:null,
    silenceDuration:null
  },
  {
    name:'popfaef-eefff-f (US-West-3)',
    lastChecked:new Date(),
    info:'Great info here.',
    id:'foo-3',
    health:100,
    state:'running',
    silenceDate:null,
    silenceDuration:null
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

var Header = Record({
  key:'TestKey',
  value:'TestValue'
});

var TestCheck = Record({
  name:'Test Check',
  info:null,
  id:null,
  method:'GET',
  target:Map({
    name:'coreos',
    type:'sg',
    id:'sg-c852dbad'
  }),
  path:'/',
  port:80,
  meta:List(),
  group:'sg-c852dbad',
  headers:List([new Header()]),
  assertions:List(),
  protocol:'http',
  // interval:null,
  // message:null,
  notifications:List(),
  instances:List(),
  health:100,
  state:'running',
  silenceDate:null,
  silenceDuration:null
})

var Check = Record({
  name:null,
  info:null,
  id:null,
  method:null,
  verb:null,
  target:Map({
    name:null,
    type:null,
    id:null,
  }),
  path:null,
  port:80,
  meta:List(),
  group:null,
  headers:List(),
  assertions:List(),
  protocol:null,
  // interval:null,
  // message:null,
  notifications:List(),
  instances:List(),
  health:100,
  state:'running',
  silenceDate:null,
  silenceDuration:null
})


function setSilence(opts){
  let check = _checks.filter((c) => c.get('id') == opts.id).first();
  if(check){
    check.silenceDate = new Date();
    check.silenceDuration = moment.duration(opts.sizelength, opts.unit).asMilliseconds();
  }
}

const statics = {
  getCheckSuccess(data){
    _data.check = statics.checkFromJS(data);
    Store.emitChange();
  },
  getChecksSuccess(data){
    _data.checks = new List(data.map(c => {
      return statics.checkFromJS(c);
    }))
    Store.emitChange();
  },
  checkFromJS(data){
    data = _.extend(data, data.check_spec.value);
    data.name = data.check_spec.value.name;
    data.method = data.verb;
    data.group = data.target.id;
    return new Check(data);
  }
}

let _data = {
  checks:new List(),
  check:new Check(),
  response:_response.toJS()
}

let _statuses = {
  getCheck:null,
  getChecks:null,
  checkCreate:null
}

const Store = Flux.createStore(
  {
    getCheck(){
      return _data.check;
    },
    getGetCheckStatus(){
      return _statuses.getCheck;
    },
    getCheckCreateStatus(){
      return _statuses.checkCreate;
    },
    getChecks(){
      return _data.checks;
    },
    getChecksStatus(){
      return _statuses.getChecks;
    },
    newCheck(){
      return new Check();
    },
    getResponse(){
      return _data.response;
    }
  }, function(payload){
    switch(payload.actionType) {
      case 'GET_CHECKS_SUCCESS':
        statics.getChecksSuccess(payload.data);
      break;
      case 'GET_CHECK_SUCCESS':
        statics.getCheckSuccess(payload.data);
      break;
      case 'CHECK_CREATE_ERROR':
        console.error(payload.data);
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