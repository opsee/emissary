import config from '../modules/config';
import request from '../modules/request';
import {createAction} from 'redux-actions';
import * as analytics from './analytics';
import * as user from './user';
import {
  APP_INITIALIZE,
  APP_SHUTDOWN,
  APP_SOCKET_START,
  APP_SOCKET_MSG,
  APP_SOCKET_ERROR,
  APP_SOCKET_OPEN,
  APP_SOCKET_CLOSE,
  APP_OPEN_CONTEXT_MENU,
  APP_CLOSE_CONTEXT_MENU,
  APP_OPEN_CONFIRM,
  APP_CLOSE_CONFIRM,
  APP_MODAL_MESSAGE_OPEN,
  APP_MODAL_MESSAGE_CLOSE,
  APP_SET_DROPDOWN_ID,
  GET_STATUS_PAGE_INFO,
  APP_SET_SCHEME
} from './constants';

function socketStart(dispatch, state){
  if (!window.socket){
    dispatch({
      type: APP_SOCKET_START
    });
    window.socket = new WebSocket(config.services.stream);
    window.socket.onopen = () => {
      const token = state().user.get('token');
      if (token && window.socket){
        window.socket.send(JSON.stringify({
          command: 'authenticate',
          attributes: {
            token
          }
        }));
        window.socket.send(JSON.stringify({
          command: 'subscribe',
          attributes: {subscribe_to: 'launch-bastion'}
        }));
        dispatch({
          type: APP_SOCKET_OPEN
        });
      }
      console.info('Socket Started.');
    };
    window.socket.onmessage = (event) => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch (err){
        console.log(err);
        return false;
      }
      if (!data){
        return false;
      }
      if (data.command !== 'heartbeat'){
        dispatch({
          type: APP_SOCKET_MSG,
          payload: data
        });
      }
      return true;
    };
    window.socket.onerror = (event) => {
      dispatch({
        type: APP_SOCKET_ERROR,
        payload: event
      });
      throw new Error('Socket Error');
    };
    window.socket.onclose = (event) => {
      dispatch({
        type: APP_SOCKET_CLOSE
      });
      if (event && typeof event.code === 'number' && !event.code.toString().match('1000|1005')){
        console.info(`Socket event code ${event.code}. Retrying in 30sec.`);
        setTimeout(() => {
          socketStart(dispatch, state);
        }, 30000);
      }
      console.info('Socket closed.');
      delete window.socket;
    };
  }
}

export function shutdown(){
  return (dispatch, state) => {
    analytics.shutdown()(dispatch, state);

    if (window.socket){
      window.socket.close();
    }
    dispatch({
      type: APP_SHUTDOWN
    });
  };
}

export function setScheme(payload, listener = false, putData = true){
  //pass listener if you are using an event listener and want to avoid recursive loop
  return (dispatch, state) => {
    if (putData){
      user.putData('scheme', payload)(dispatch, state);
    }
    dispatch({
      type: APP_SET_SCHEME,
      payload,
      meta: {
        listener
      }
    });
  };
}

export function initialize(){
  return (dispatch, state) => {
    analytics.initialize()(dispatch, state);
    if (state().user.get('token') && state().user.get('id')){
      setTimeout(() => {
        socketStart(dispatch, state);
      }, config.socketStartDelay || 0);
    }
    dispatch({
      type: APP_INITIALIZE
    });
    window.addEventListener('storage', event => {
      if (typeof event === 'object' && event.key === 'scheme') {
        setScheme(JSON.parse(event.newValue), true)(dispatch);
      }
    });
  };
}

export function getStatusPageInfo() {
  return dispatch => {
    dispatch({
      type: GET_STATUS_PAGE_INFO,
      payload: request.get(`${config.services.statusPage}/summary.json`)
        .then(res => res.body)
    });
  };
}

export const openContextMenu = createAction(APP_OPEN_CONTEXT_MENU);
export const closeContextMenu = createAction(APP_CLOSE_CONTEXT_MENU);
export const modalMessageOpen = createAction(APP_MODAL_MESSAGE_OPEN);
export const modalMessageClose = createAction(APP_MODAL_MESSAGE_CLOSE);
export const confirmOpen = createAction(APP_OPEN_CONFIRM);
export const confirmClose = createAction(APP_CLOSE_CONFIRM);
export const setDropdownId = createAction(APP_SET_DROPDOWN_ID);