import constants from '../constants';
import Flux from '../Flux';

// data storage
let _data = [
  {
    title:'moo',
    completed:false
  }
];

function addItem(title, completed=false) {
  _data.push({title, completed});
}

function clear(){
  _data = [];
}

const TodoStore = Flux.createStore(
  {
    getAll(){
      return {
        tasks: _data
      }
    }
  }, function(payload){
    switch(payload.actionType) {
      case 'TASK_ADDED':
        let text = payload.text.trim();
        if (text !== '') {
          addItem(text);
          TodoStore.emitChange();
        }
        break;

      case 'CLEARED_LIST':
        clear();
        TodoStore.emitChange();
      // add more cases for other actionTypes...
    }
  }
)

export default TodoStore;
