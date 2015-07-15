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
  let index = _.findIndex(_checks, {id:opts.check.id});
    if(index > -1){
      console.log('yes',index);
      let check = _checks[index];
      check.name = 'Wow!';
      check.status.silence.startDate = new Date();
      check.status.silence.duration = moment.duration(opts.length, opts.unit).asMilliseconds();
      // if($rootScope.user.hasUser()){
      //   check.status.silence.user = $rootScope.user.name || $rootScope.user.email;
      //   check.status.silence.user = 'you';
      // }
    }
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
      console.log(_checks[0]);
      StyleguideStore.emitChange();
      break;
      // add more cases for other actionTypes...
    }
  }
)

export default StyleguideStore;