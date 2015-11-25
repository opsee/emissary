import {isFSA} from 'flux-standard-action';
import uuid from 'node-uuid';
import _ from 'lodash';

function isPromise(val) {
  return val && typeof val.then === 'function';
}

export function promiseMiddleware({ dispatch }) {
  return next => action => {
    if (!isFSA(action)) {
      return isPromise(action)
        ? action.then(dispatch)
        : next(action);
    }
    if(isPromise(action.payload)){
      const aType = `${action.type}_REQ`;
      const id = uuid.v1();
      dispatch({
        type: aType,
        payload:{
          status: 'pending',
          time: Date.now(),
          id
        }
      });
      return action.payload.then(
        result => {
          dispatch({
            type: aType,
            payload: {
              time: Date.now(),
              status: 'success',
              id
            }
          });
          return dispatch(_.assign({}, action, {payload: result}));
        },
        error => {
          dispatch({
            type: aType,
            payload: {
              time: Date.now(),
              status: 'error',
              id
            }
          });
          return dispatch(_.assign({}, action, {payload: error, error: true }));
        }
      );
    }
    return next(action);
  };
}