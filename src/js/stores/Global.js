import config from '../modules/config';
import Flux from '../modules/flux';
import storage from '../modules/storage';
import _ from 'lodash';

let statics = {
  globalModalMessage(kwargs){
    _data.modalMessage = {
      used:false,
      options:{
        html:kwargs.html,
        style:kwargs.style
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
    options:null
  },
  showNav:true
}

let _statuses = {
  globalSocketConnect:null
}

const Store = Flux.createStore(
  {
    getModalMessage(){
      return !_data.modalMessage.used && _data.modalMessage.options;
    },
    getSocketMessages(){
      return _data.socketMessages;
    },
    getSocketStarted(){
      return _data.socketStarted;
    },
    getShowNav(){
      return _data.showNav;
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
          }, i*500);
        });
      break;
      case 'GLOBAL_SOCKET_MESSAGE':
        statics.parseSocketMessage(payload.data);
      break;
      case 'GLOBAL_SET_NAV':
        _data.showNav = payload.data;
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
