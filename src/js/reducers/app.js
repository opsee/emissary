// import storage from '../modules/storage';
import _ from 'lodash';
import {handleActions} from 'redux-actions';
import {
  APP_INITIALIZE,
  APP_SOCKET_OPEN,
  APP_SOCKET_MSG,
  APP_SOCKET_ERROR,
  APP_SHUTDOWN,
  APP_OPEN_CONTEXT_MENU,
  APP_CLOSE_CONTEXT_MENU
} from '../reduxactions/constants';

const initial = {
  socketMessages: [],
  ready: false,
  openContextMenu: undefined
};

export default handleActions({
  '@@reduxReactRouter/routerDidChange': {
    next(state){
      return _.assign({}, state, {
        openContextMenu: undefined
      });
    }
  },
  [APP_INITIALIZE]: {
    next(state){
      return _.assign({}, state, {ready: true});
    }
  },
  [APP_SOCKET_OPEN]: {
    next(state){
      return _.assign({}, state, {
        socketError: false
      });
    }
  },
  [APP_SOCKET_MSG]: {
    next(state, action){
      const data = _.assign({}, action.payload, {date: new Date()});
      const socketMessages = state.socketMessages.concat([data]);
      return _.assign({}, state, {socketMessages});
    }
  },
  [APP_SOCKET_ERROR]: {
    next(state){
      return _.assign({}, state, {
        socketError: true
      });
    }
  },
  [APP_SHUTDOWN]: {
    next(state){
      return _.assign({}, state, {
        socketMessages: [],
        socketError: undefined
      });
    }
  },
  [APP_OPEN_CONTEXT_MENU]: {
    next(state, action){
      return _.assign({}, state, {
        openContextMenu: action.payload
      });
    }
  },
  [APP_CLOSE_CONTEXT_MENU]: {
    next(state){
      return _.assign({}, state, {
        openContextMenu: undefined
      });
    }
  }
}, initial);