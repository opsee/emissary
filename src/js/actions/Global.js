import Flux from '../modules/flux';
import _ from 'lodash';
import {UserStore} from '../stores';
import config from '../modules/config';

let _actions = {};
let socket;

_actions.globalModalMessage = Flux.statics.addAction('globalModalMessage');

_actions.globalContextMenu = Flux.statics.addAction('globalContextMenu');

_actions.globalModalMessageConsume = Flux.statics.addAction('globalModalMessageConsume');

_actions.globalSocketStart = Flux.statics.addAction('globalSocketStart', () => {
  if (!socket){
    socket = new WebSocket(config.socket);
    socket.onopen = () => {
      Flux.actions.globalSocketAuth();
      Flux.actions.globalSocketSubscribe('launch-bastion');
      console.info('Socket Started.');
    };
    socket.onmessage = (event) => {
      let data;
      try {
        data = JSON.parse(event.data);
      }catch (err){
        console.log(err);
        return false;
      }
      if (!data){
        return false;
      }
      if (data.command !== 'heartbeat'){
        Flux.actions.globalSocketMessage(data);
      }
    };
    socket.onerror = (event) => {
      Flux.actions.globalSocketError(event);
      socket = undefined;
      console.info('Socket Error.');
    };
  }
});

_actions.globalSocketAuth = Flux.statics.addAction('globalSocketAuth', () => {
  const auth = UserStore.getAuth();
  if (auth && socket){
    const authCmd = JSON.stringify({
      command: 'authenticate',
      attributes: {
        token: auth.replace('Bearer ', '')
      }
    });
    socket.send(authCmd);
  }
});

_actions.globalSocketSubscribe = Flux.statics.addAction('globalSocketSubscribe', (str) => {
  const auth = UserStore.getAuth();
  if (auth && socket && str){
    const authCmd = JSON.stringify({
      command: 'subscribe',
      attributes: {subscribe_to: str}
    });
    socket.send(authCmd);
  }
});

_actions.globalSocketMessage = Flux.statics.addAction('globalSocketMessage');

_actions.globalSocketError = Flux.statics.addAction('globalSocketError');

_actions.globalSetNav = Flux.statics.addAction('globalSetNav');

export default _.assign({}, ..._.values(_actions));