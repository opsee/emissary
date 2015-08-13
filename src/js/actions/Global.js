import Constants from '../Constants';
import Flux from '../Flux';
import request from '../request';
import UserStore from '../stores/User';
import response from '../response';

const actions = Flux.createActions({
  globalModalMessage(data){
    return {
      actionType: 'GLOBAL_MODAL_MESSAGE',
      data:data
    }
  }
});

export default actions;