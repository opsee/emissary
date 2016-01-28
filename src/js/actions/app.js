import config from '../modules/config';
import {createAction} from 'redux-actions';
import * as analytics from './analytics';
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
  APP_MODAL_MESSAGE_OPEN,
  APP_MODAL_MESSAGE_CLOSE
} from './constants';

function socketStart(dispatch, state){
  if (!window.socket){
    dispatch({
      type: APP_SOCKET_START
    });
    window.socket = new WebSocket(config.socket);
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
      }catch (err){
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
    };
    window.socket.onerror = (event) => {
      dispatch({
        type: APP_SOCKET_ERROR,
        payload: event
      });
      console.info('Socket Error.');
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
  return (dispatch) => {
    dispatch({
      type: APP_SHUTDOWN
    });
  };
}

export function initialize(){
  return (dispatch, state) => {
    analytics.initialize()(dispatch, state);

    if (state().user.get('token') && state().user.get('id')){
      const user = state().user.toJS();

      // FIXME Legacy analytics -- remove when Launch Darkly added to Myst
      if (window.ldclient){
        window.ldclient.identify({
          firstName: user.name,
          key: user.id.toString(),
          email: user.email,
          custom: {
            customer_id: user.customer_id,
            id: user.id
          }
        });
      }
      setTimeout(() => {
        socketStart(dispatch, state);
      }, config.socketStartDelay || 0);
    }
    dispatch({
      type: APP_INITIALIZE
    });
  };
}

export const openContextMenu = createAction(APP_OPEN_CONTEXT_MENU);
export const closeContextMenu = createAction(APP_CLOSE_CONTEXT_MENU);
export const modalMessageOpen = createAction(APP_MODAL_MESSAGE_OPEN);
export const modalMessageClose = createAction(APP_MODAL_MESSAGE_CLOSE);