import config from '../modules/config';
import Flux from '../modules/flux';

const actions = Flux.createActions({
  addItem:function(text){
    return {
      actionType: 'TASK_ADDED',
      text:text
    }
  },
  clearList:function(text){
    return {
      actionType: 'CLEARED_LIST',
      text:text
    }
  },
  completeTask(task) {
    console.warn('completeTask action not yet implemented...');
  }
});

export default actions;