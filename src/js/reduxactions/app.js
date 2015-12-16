import config from '../modules/config';
import {createAction} from 'redux-actions';
import {
  APP_INITIALIZE,
  APP_SHUTDOWN,
  APP_SOCKET_START,
  APP_SOCKET_MSG,
  APP_SOCKET_ERROR,
  APP_SOCKET_OPEN,
  APP_SOCKET_CLOSE,
  APP_OPEN_CONTEXT_MENU,
  APP_CLOSE_CONTEXT_MENU
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
      window.socket.close();
      delete window.socket;
      console.info('Socket Error. Retrying in 30sec.');
      setTimeout(() => {
        socketStart(dispatch, state);
      }, 30000);
    };
    window.socket.onclose = () => {
      dispatch({
        type: APP_SOCKET_CLOSE
      });
      console.info('Socket closed.');
      delete window.socket;
    };
  }
}

export function shutdown(){
  return (dispatch) => {
    window.Intercom('shutdown');
    if (window.socket){window.socket.close();}
    dispatch({
      type: APP_SHUTDOWN
    });
  };
}

export function initialize(){
  return (dispatch, state) => {
    if (state().user.get('token')){
      const user = state().user.toJS();
      if (window.Intercom){
        window.Intercom('boot', {
          app_id: 'mrw1z4dm',
          email: user.email,
          user_hash: user.intercom_hmac
        });
      }
      if (window.ldclient){
        window.ldclient.identify({
          firstName: user.name,
          lasName: user.name,
          key: user.id,
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