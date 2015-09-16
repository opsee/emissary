import config from '../modules/config';
import Flux from '../modules/flux';
import request from '../modules/request';
import _ from 'lodash';
import {GlobalStore, UserStore} from '../stores';

let _actions = {};
let socket;

_actions.globalModalMessage = Flux.statics.addAction('globalModalMessage');

_actions.globalModalMessageConsume = Flux.statics.addAction('globalModalMessageConsume');

_actions.globalSocketStart = Flux.statics.addAction('globalSocketStart', function(){
  if(!socket){
    console.info('Socket Started.');
    socket = new WebSocket('wss://api-beta.opsee.co/stream/');
    socket.onopen = function(event){
      Flux.actions.globalSocketAuth();
      Flux.actions.globalSocketSubscribe('launch-bastion');
    }
    socket.onmessage = function(event){
      let data;
      try{
        data = JSON.parse(event.data)
      }catch(err){
        console.log(err);
        return false;
      }
      if(!data){
        return false;
      }
      if(data.command != 'heartbeat'){
        Flux.actions.globalSocketMessage(data);
      }
    }
  }
});

_actions.globalSocketAuth = Flux.statics.addAction('globalSocketAuth', () => {
  const auth = UserStore.getAuth();
  if(auth && socket){
    const authCmd = JSON.stringify({
      command:'authenticate',
      attributes:{
        token:auth.replace('Bearer ','')
      }
    });
    socket.send(authCmd);
  }
});

_actions.globalSocketSubscribe = Flux.statics.addAction('globalSocketSubscribe', (str) => {
  const auth = UserStore.getAuth();
  if(auth && socket && str){
    const authCmd = JSON.stringify({
      command:'subscribe',
      attributes:{subscribe_to:str}
    });
    socket.send(authCmd);
  }
});

_actions.globalSocketMessage = Flux.statics.addAction('globalSocketMessage');

_actions.globalSetNav = Flux.statics.addAction('globalSetNav');

export default _.assign({}, ..._.values(_actions));