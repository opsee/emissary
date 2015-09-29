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
      type:'code',
      relationship:'equal',
      operand:200
    },
    {
      type:'code',
      relationship:'equal',
      operand:200
    },
    {
      type:'code',
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

const response = Immutable.fromJS({
  "responses": [
    {
      "target": {
        "type": "instance",
        "id": "i-39aae6fb"
      },
      "response": {
        "type_url": "HttpResponse",
        "value": {
          "code": 200,
          "body": {
            "metadata": {},
            "saved_search": {
              "saved_search_id": "224v333g",
              "hash_user_id": "1b8c236ef38a9b92391c9b0feeafeflk3j43rar",
              "search_params": {
                "location": "San Francisco, CA, United States",
                "checkin": "2015-09-27T07:00:00.000Z",
                "checkout": "2015-10-03T07:00:00.000Z",
                "price_min": 120,
                "price_max": 215,
                "room_types": [
                  "Entire home/apt"
                ],
                "search_by_map": true,
                "sw_lng": -122.43045874435649,
                "sw_lat": 37.77507952087628,
                "ne_lng": -122.39556856949076,
                "ne_lat": 37.8077186642931,
                "zoom": 15,
                "initial_sw_lng": -122.62259570942877,
                "initial_sw_lat": 37.58761195180962,
                "initial_ne_lng": -122.28167621479986,
                "initial_ne_lat": 37.96047848170684
              },
              "modified_at": 1443569968560,
              "source": "web"
            }
          },
          "headers": [
            {
              "name": "Content-Type",
              "values": [
                "text/html; charset=UTF-8"
              ]
            },
            {
              "name": "Vary",
              "values": [
                "origin"
              ]
            },
            {
              "name": "Content-Length",
              "values": [
                "4"
              ]
            },
            {
              "name": "Server",
              "values": [
                "Jetty(9.2.z-SNAPSHOT)"
              ]
            }
          ],
          "metrics": [
            {
              "name": "request_latency_ms",
              "value": 80.84540600000001
            }
          ]
        }
      }
    }
  ]
});

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
  id:undefined,
  name:null,
  info:null,
  target:Map({
    name:undefined,
    type:'sg',
    id:undefined,
  }),
  assertions:List(),
  notifications:List(),
  instances:List(),
  health:100,
  state:'running',
  silenceDate:undefined,
  silenceDuration:undefined,
  interval:30,
  check_spec:Map({
    type_url:'HttpCheck',
    value:Map({
      name:undefined,
      path:undefined,
      protocol:'http',
      port:undefined,
      verb:'GET',
      headers:new List()
  silenceDate:null,
  silenceDuration:null,
  interval:30,
  check_spec:Map({
    type_url:'HttpCheck',
    value:Map({
      name:undefined,
      path:undefined,
      protocol:'http',
      port:undefined,
      verb:'GET',
      headers:new List()
    })
  })
})


function setSilence(opts){
  let check = _checks.filter((c) => c.get('id') == opts.id).first();
  if(check){
    check.silenceDate = new Date();
    check.silenceDuration = moment.duration(opts.sizelength, opts.unit).asMilliseconds();
  }
}

const statics = {
  getCheckPending(id){
    if(_data.check.get('id') != id){
      _data.check = new Check();
    }
  },
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
    data = _.merge(data, data.check_spec.value);
    data.name = data.check_spec.value.name;
    data.check_spec.value.headers = data.check_spec.value.headers || [];
    return new Check(data);
  }
}

let _data = {
  checks:new List(),
  check:new Check(),
  response:undefined
}

let _statuses = {
  getCheck:null,
  getChecks:null,
  checkCreate:null,
  deleteCheck:null,
  checkEdit:null,
  testCheck:null
}

const _public = {
  getCheck(){
    return _data.check;
  },
  getChecks(targetId){
    if(targetId){
      return _data.checks.filter(c => {
        return c.get('target').id == targetId;
      });
    }
    return _data.checks;
  },
  newCheck(){
    return new Check();
  },
  getResponse(){
    let response;
    if(_data.response){
      response = _.chain(_data.response.toJS()).get('responses').first().get('response.value').value();
    }
    return response;
  },
  getFormattedResponse(data){
    if(data){
      let response = _.cloneDeep(data);
      if(response.headers){
        response.headers = response.headers.map(h => {
          h.values = h.values.join(', ');
          return h;
        });
        let headerObj = {};
        response.headers.forEach(h => {
          headerObj[h.name] = h.values;
        });
        response.headers = headerObj;
      }
      return _.omit(response, 'metrics');
    }
    let response = _.cloneDeep(data);
    response.headers = response.headers.map(h => {
      h.values = h.values.join(', ');
      return h;
    });
    let headerObj = {};
    response.headers.forEach(h => {
      headerObj[h.name] = h.values;
    });
    response.headers = headerObj;
    delete response.metrics;
    return response;
  }
}

let statusFunctions = {};
let keys = _.chain(_statuses).keys().map(k => {
  let arr = [k]
  arr.push('get'+_.startCase(k).split(' ').join('')+'Status');
  return arr;
}).forEach(a => {
  statusFunctions[a[1]] = function(){
    return _statuses[a[0]]
  }
}).value();

const Store = Flux.createStore(
  _.assign({}, _public, statusFunctions),
  function(payload){
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
      case 'GET_CHECK_PENDING':
        statics.getCheckPending(payload.data);
      break;
      case 'TEST_CHECK_SUCCESS':
        _data.response = payload.data;
        Store.emitChange();
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