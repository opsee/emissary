import config from '../modules/config';
import Flux from '../modules/flux';
import _ from 'lodash';
import moment from 'moment';
import Immutable, {Record, List, Map} from 'immutable';

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

var Target = Record({
  name:undefined,
  type:'sg',
  id:undefined
});

var Notification = Record({
  type:undefined,
  value:undefined
})

var Check = Record({
  id:undefined,
  name:'',
  target:Target(),
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
      verb:undefined,
      body:undefined,
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
    // data.notifications = data.notifications.map(n => {
    //   return new Notification(n);
    // });
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
  newCheck(data){
    return new Check(data);
  },
  getResponse(){
    return _data.response;
  },
  getFakeResponse(){
    return response;
  },
  getFormattedResponse(data){
    if(data && data.size){
      const first = data.toJS()[0];
      let response = _.cloneDeep(first);
      const headers = _.get(response, 'response.value.headers');
      if(headers){
        response.response.value.headers = headers.map(h => {
          h.values = h.values.join(', ');
          return h;
        });
        let headerObj = {};
        response.response.value.headers.forEach(h => {
          headerObj[h.name] = h.values;
        });
        response.response.value.headers = headerObj;
      }
      if(response.error){
        try {
          let err = JSON.parse(response.error);
          if(err && err.error){
            response.error = err.error;
          }else{
            reponse.error = err;
          }
        }catch(err){

        }
      }
      if(_.get(response, 'response.value.metrics')){
        delete response.response.value.metrics;
      }
      return response;
      // return _.omit(response, 'response.value.metrics');
    }
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
        _data.response = Immutable.fromJS(payload.data);
        Store.emitChange();
      break;
      case 'RESET_TEST_CHECK':
        _data.response = undefined;
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