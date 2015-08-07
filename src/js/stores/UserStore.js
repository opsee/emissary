import Constants from '../Constants';
import Flux from '../Flux';

// data storage
let _user = {
  name:null,
  email:null,
  id:null,
  token:null
}

function addItem(title, completed=false) {
  _data.push({title, completed});
}

function clear(){
  _data = [];
}

const UserStore = Flux.createStore(
  {
    getUser(){
      return _user
    }
  }, function(payload){
    switch(payload.actionType) {
      case 'USER_LOGIN':
        let text = payload.text.trim();
        if (text !== '') {
          addItem(text);
          UserStore.emitChange();
        }
        break;

      case 'CLEARED_LIST':
        clear();
        UserStore.emitChange();
    }
  }
)

export default UserStore;
