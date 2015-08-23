import constants from '../constants';
import Flux from '../Flux';
import request from '../request';
import UserStore from '../stores/User';
import _ from 'lodash';
import socket from '../socket';

let _actions = {};

_actions.globalModalMessage = Flux.statics.addAction('globalModalMessage');

_actions.globalModalMessage = Flux.statics.addAction('globalModalMessageConsume');

_actions.globalSocketAuth = Flux.statics.addAction('globalSocketAuth', () => {
  const auth = UserStore.getAuth();
  if(auth){
    const authCmd = JSON.stringify({
      command:'authenticate',
      attributes:{
        hmac:auth.replace('HMAC ','')
      }
    });
    socket.send(authCmd);
  }
});

_actions.globalSocketMessage = Flux.statics.addAction('globalSocketMessage');

export default _.assign({}, ..._.values(_actions));