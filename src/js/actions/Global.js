import constants from '../constants';
import Flux from '../Flux';
import request from '../request';
import UserStore from '../stores/User';
import _ from 'lodash';
import Socket from '../socket';

let _actions = {};
let socket;

_actions.globalModalMessage = Flux.statics.addAction('globalModalMessage');

_actions.globalModalMessage = Flux.statics.addAction('globalModalMessageConsume');

_actions.globalSocketStart = Flux.statics.addAction('globalSocketStart', function(){
  socket = Socket();
});

_actions.globalSocketAuth = Flux.statics.addAction('globalSocketAuth', () => {
  const auth = UserStore.getAuth();
  if(auth && socket){
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