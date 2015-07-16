import Constants from '../Constants';
import Flux from '../Flux';

const actions = Flux.createActions({
  silence:function(id, length = 1, unit = 'm'){
    return {
      actionType: 'CHECK_SILENCE',
      text:{id, length, unit}
    }
  },
  clearList:function(text){
    return {
      actionType: 'CLEARED_LIST',
      text:text
    }
  }
});

export default actions;