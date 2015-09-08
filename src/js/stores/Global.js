import config from '../modules/config';
import Flux from '../modules/flux';
import storage from '../modules/storage';

let statics = {
  globalModalMessage(data){
    _data.modalMessage = {
      used:false,
      msg:{
        __html:data
      }
    };
    Store.emitChange();
  },
  globalModalMessageConsume(){
    _data.modalMessage.used = true;
  },
  globalSocketStart(){
    _data.socketStarted = true;
    Store.emitChange();
  },
  parseSocketMessage(msg = {command:null}){
    if(msg.command && msg.command != 'heartbeat'){
      _data.socketMessages.push(msg);
      Store.emitChange();
    }
  }
}

let _data = {
  socketStarted:false,
  socketMessages:[],
  modalMessage:{
    used:false,
    msg:null
  }
}

let _statuses = {
  globalSocketConnect:null
}

const Store = Flux.createStore(
  {
    getModalMessage(){
      return !_data.modalMessage.used && _data.modalMessage.msg;
    },
    getSocketMessages(){
      return _data.socketMessages;
    },
    getSocketStarted(){
      return _data.socketStarted;
    }
  }, function(payload){
    switch(payload.actionType) {
      case 'GLOBAL_MODAL_MESSAGE':
        statics.globalModalMessage(payload.data);
      break;
      case 'GLOBAL_MODAL_MESSAGE_CONSUME':
        statics.globalModalMessageConsume(payload.data);
      break;
      case 'GLOBAL_SOCKET_START':
        statics.globalSocketStart(payload.data);
      break;
      case 'GLOBAL_SOCKET_CONNECT_SUCCESS':
        console.log(payload.data);
      break;
      case 'ONBOARD_EXAMPLE_INSTALL_SUCCESS':
        payload.data.forEach(function(d, i){
          setTimeout(function(){
            _data.socketMessages.push(d);
            Store.emitChange();
          }, i*1000);
        });
        console.log(payload.data);
      break;
      case 'GLOBAL_SOCKET_MESSAGE':
        statics.parseSocketMessage(payload.data);
      break;
    }
    const newStatuses = Flux.statics.statusProcessor(payload, _statuses);
    if(!_.isEqual(_statuses, newStatuses)){
      _statuses = newStatuses;
      Store.emitChange();  
    }
  }
)

export default Store;
