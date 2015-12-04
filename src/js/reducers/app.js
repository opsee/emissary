// import storage from '../modules/storage';
import _ from 'lodash';
import {handleActions} from 'redux-actions';
import {
  APP_INITIALIZE,
  APP_SOCKET_OPEN,
  APP_SOCKET_MSG,
  APP_SOCKET_ERROR
} from '../reduxactions/constants';

const initial = {
  socketMessages: []
};

export default handleActions({
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
  }
}, initial);