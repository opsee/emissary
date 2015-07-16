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

function setSilence(opts){
  let index = _.findIndex(_check, {id:opts.id});
    if(index > -1){
      let check = _checks[index];
      check.status.silence.startDate = new Date();
      check.status.silence.duration = moment.duration(opts.length, opts.unit).asMilliseconds();
      check.status.silence.remaining = getSilenceRemaining(check);
      check.status.silence.timer = setInterval(() => regenSilenceRemaining(check),1000);
      // if($rootScope.user.hasUser()){
      //   check.status.silence.user = $rootScope.user.name || $rootScope.user.email;
      //   check.status.silence.user = 'you';
      // }
    }
}

function regenSilenceRemaining(check){
  if(check && check.status.silence.remaining > 0){
    check.status.silence.remaining -= 1000;
  }else{
    clearInterval(check.status.silence.timer);
  }
  CheckStore.emitChange();
}

function getSilenceRemaining(check){
  if(check && check.status.silence.startDate){
    const startDate = check.status.silence.startDate;
    if(startDate instanceof Date){
      const finalVal = startDate.valueOf() + check.status.silence.duration;
      return finalVal - Date.now();
    }
  }
  return false;
}

const CheckStore = Flux.createStore(
  {
    getInstance(){
      return _instance;
    }
  }, function(payload){
    switch(payload.actionType) {
      case 'CHECK_SILENCE':
      setSilence(payload.text);
      CheckStore.emitChange();
      break;
      // add more cases for other actionTypes...
    }
  }
)

export default CheckStore;