import constants from '../constants';
import Flux from '../Flux';
import request from '../request';
import UserStore from '../stores/User';

const actions = Flux.createActions({
  globalModalMessage(data){
    return {
      actionType: 'GLOBAL_MODAL_MESSAGE',
      data:data
    }
  }
});

export default actions;