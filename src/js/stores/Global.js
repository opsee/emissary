import constants from '../constants';
import Flux from '../Flux';
import request from 'superagent';
import storage from '../storage';

let _modalMessage = 'foo';

const Store = Flux.createStore(
  {
    getModalMessage(){
      return _modalMessage;
    },
  }, function(payload){
    switch(payload.actionType) {
      case 'GLOBAL_MODAL_MESSAGE':
        _modalMessage = {__html:payload.data};
        Store.emitChange();
      break;
    }
  }
)

export default Store;
