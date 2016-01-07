import {pushState} from 'redux-router';

import config from '../modules/config';
import request from '../modules/request';
import {
  SEARCH_SET
} from './constants';

export function set(string){
  return (dispatch, state) => {
    dispatch({
      type: SEARCH_SET,
      payload: new Promise((resolve, reject) => {
        if (state().router.location.pathname !== '/search'){
          setTimeout(() => {
            dispatch(pushState(null, '/search'));
          }, 40);
        }
        return resolve(string);
      })
    });
  };
}