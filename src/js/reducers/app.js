// import storage from '../modules/storage';
import _ from 'lodash';
import {handleActions} from 'redux-actions';
import {storage} from '../modules';
import {Map} from 'immutable';
import {
  APP_INITIALIZE,
  APP_SOCKET_OPEN,
  APP_SOCKET_MSG,
  APP_SOCKET_ERROR,
  APP_SHUTDOWN,
  APP_OPEN_CONTEXT_MENU,
  APP_CLOSE_CONTEXT_MENU,
  APP_OPEN_CONFIRM,
  APP_CLOSE_CONFIRM,
  APP_MODAL_MESSAGE_OPEN,
  APP_MODAL_MESSAGE_CLOSE,
  APP_SET_SCHEME,
  APP_SET_DROPDOWN_ID,
  GET_STATUS_PAGE_INFO,
  INTERCOM_SHOW,
  INTERCOM_HIDE
} from '../actions/constants';

const initial = {
  socketMessages: [],
  socketError: undefined,
  ready: false,
  openContextMenu: undefined,
  dropdownId: undefined,
  modalMessage: {
    color: undefined,
    html: undefined,
    show: false
  },
  confirmMessage: {
    show: false,
    color: null,
    html: null,
    confirmText: '',
    onConfirm: null
  },
  statusPageInfo: new Map(),
  intercomStatus: undefined,
  scheme: storage.get('scheme')
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
  },
  [APP_OPEN_CONFIRM]: {
    next(state, action){
      return _.assign({}, state, {
        confirmMessage: _.assign({}, action.payload, {show: true})
      });
    }
  },
  [APP_CLOSE_CONFIRM]: {
    next(state){
      const confirmMessage = _.assign({}, state.confirmMessage, {
        show: false
      });
      return _.assign({}, state, {confirmMessage});
    }
  },
  [APP_MODAL_MESSAGE_OPEN]: {
    next(state, action){
      return _.assign({}, state, {
        modalMessage: _.assign({}, action.payload, {show: true})
      });
    }
  },
  [APP_MODAL_MESSAGE_CLOSE]: {
    next(state){
      const modalMessage = _.assign({}, state.modalMessage, {
        show: false
      });
      return _.assign({}, state, {modalMessage});
    }
  },
  [APP_SET_DROPDOWN_ID]: {
    next(state, action){
      return _.assign({}, state, {dropdownId: action.payload});
    }
  },
  [GET_STATUS_PAGE_INFO]: {
    next(state, action){
      return _.assign({}, state, {statusPageInfo: new Map(action.payload)});
    }
  },
  [INTERCOM_SHOW]: {
    next(state){
      const intercomStatus = 'visible';
      return _.assign({}, state, {intercomStatus});
    }
  },
  [INTERCOM_HIDE]: {
    next(state){
      const intercomStatus = 'hidden';
      return _.assign({}, state, {intercomStatus});
    }
  },
  [APP_SET_SCHEME]: {
    next(state, action){
      const scheme = action.payload;
      storage.set('scheme', scheme);
      document.querySelector('body').className = scheme;
      return _.assign({}, state, {scheme});
    }
  }
}, initial);