import Constants from '../Constants';
import Flux from '../Flux';
import _ from 'lodash';
import moment from 'moment';

// data storage
let _checks = [
  {
    name:'My great check',
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
    name:'My great check2',
    info:'Fun info here2.',
    id:'feee',
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
    name:'My great check3',
    info:'Fun info here2.',
    id:'moo',
    status:{
      health:0,
      state:'unmonitored',
      silence:{
        startDate:null,
        duration:null
      }
    },
  },
  {
    name:'My great check3',
    info:'Fun info here2.',
    id:'ma',
    status:{
      health:0,
      state:'stopped',
      silence:{
        startDate:null,
        duration:null
      }
    },
  },
]

function setSilence(opts){
  let index = _.findIndex(_checks, {id:opts.id});
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
  StyleguideStore.emitChange();
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

const StyleguideStore = Flux.createStore(
  {
    getChecks(){
      return _checks;
    }
  }, function(payload){
    switch(payload.actionType) {
      case 'CHECK_SILENCE':
      setSilence(payload.text);
      StyleguideStore.emitChange();
      break;
      // add more cases for other actionTypes...
    }
  }
)

export default StyleguideStore;