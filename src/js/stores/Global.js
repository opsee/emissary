import Constants from '../Constants';
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
        _modalMessage = payload.data;
        Store.emitChange();
      break;
    }
  }
)

export default Store;
