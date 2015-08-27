import config from '../config';
import Flux from '../Flux';
import storage from '../storage';

let _modalMessage = {
  used:false,
  msg:null
}

let _statuses = {
  globalSocketConnect:null
}

let _socketMessages = [];

let statics = {
  parseSocketMessage(msg = {command:null}){
    if(msg.command && msg.command != 'heartbeat'){
      _socketMessages.push(msg);
    }
  }
}

const Store = Flux.createStore(
  {
    getModalMessage(){
      return !_modalMessage.used && _modalMessage.msg;
    },
    getSocketMessages(){
      return _socketMessages;
    }
  }, function(payload){
    switch(payload.actionType) {
      case 'GLOBAL_MODAL_MESSAGE':
        _modalMessage = {
          used:false,
          msg:{
            __html:payload.data
          }
        };
      break;
      case 'GLOBAL_MODAL_MESSAGE_CONSUME':
        _modalMessage.used = true;
      break;
      case 'GLOBAL_SOCKET_CONNECT_SUCCESS':
        console.log(payload.data);
      break;
      case 'GLOBAL_SOCKET_MESSAGE':
        statics.parseSocketMessage(payload.data);
      break;
    }
    _statuses = Flux.statics.statusProcessor(payload, _statuses);
    Store.emitChange();
  }
)

export default Store;
