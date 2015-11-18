import Flux from '../modules/flux';
import _ from 'lodash';

/* eslint-disable no-use-before-define */

let statics = {
  globalModalMessage(kwargs){
    _data.modalMessage = {
      used: false,
      options: {
        html: kwargs.html,
        style: kwargs.style
      }
    };
    Store.emitChange();
  },
  globalModalMessageConsume(){
    _data.modalMessage.used = true;
  },
  globalContextMenu(kwargs){
    _data.modalMessage = {
      used: false,
      options: {
        html: kwargs.html,
        type: 'context'
      }
    };
    Store.emitChange();
  },
  globalContextMenuConsume(){
    _data.modalMessage.used = true;
  },
  parseSocketMessage(msg = {command: null}){
    if (msg.command && msg.command !== 'heartbeat'){
      _data.socketMessages.push(msg);
      Store.emitChange();
    }
  },
  _statuses: {
    globalSocketConnect: null
  }
};

let _data = {
  socketMessages: [],
  modalMessage: {
    used: false,
    options: null
  },
  showNav: true,
  globalSocketError: null
};

const _public = {
  getModalMessage(){
    return !_data.modalMessage.used && _data.modalMessage.options;
  },
  getSocketMessages(){
    return _data.socketMessages;
  },
  getShowNav(){
    return _data.showNav;
  },
  getGlobalSocketError(){
    return _data.globalSocketError;
  }
};

const statusFunctions = Flux.statics.generateStatusFunctions(statics);

const Store = Flux.createStore(
  _.assign({}, _public, statusFunctions),
  function handlePayload(payload){
    switch (payload.actionType) {
    case 'GLOBAL_MODAL_MESSAGE':
      statics.globalModalMessage(payload.data);
      break;
    case 'GLOBAL_MODAL_MESSAGE_CONSUME':
      statics.globalModalMessageConsume(payload.data);
      break;
    case 'GLOBAL_CONTEXT_MENU':
      statics.globalContextMenu(payload.data);
      break;
    case 'GLOBAL_CONTEXT_MENU_CONSUME':
      statics.globalContextMenuConsume(payload.data);
      break;
    case 'GLOBAL_SOCKET_CONNECT_SUCCESS':
      console.log(payload.data);
      break;
    case 'ONBOARD_EXAMPLE_INSTALL_SUCCESS':
      payload.data.forEach((d, i) => {
        setTimeout(() => {
          _data.socketMessages.push(d);
          Store.emitChange();
        }, i * 500);
      });
      break;
    case 'GLOBAL_SOCKET_MESSAGE':
      statics.parseSocketMessage(payload.data);
      break;
    case 'GLOBAL_SET_NAV':
      _data.showNav = payload.data;
      Store.emitChange();
      break;
    case 'GLOBAL_SOCKET_ERROR':
      _data.globalSocketError = payload.data;
      Store.emitChange();
      break;
    default:
      break;
    }
    const statusData = Flux.statics.statusProcessor(payload, statics, Store);
    statics._statuses = statusData.statuses;
    if (statusData.haveChanged){
      Store.emitChange();
    }
  }
);

export default Store;
