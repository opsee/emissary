import {pushState, replaceState} from 'redux-router';
import _ from 'lodash';
import {stringFromTokens} from '../modules';

import {
  SEARCH_SET_STRING,
  SEARCH_SET_TOKENS
} from './constants';

export function setString(string){
  return (dispatch, state) => {
    dispatch({
      type: SEARCH_SET_STRING,
      payload: new Promise((resolve) => {
        if (state().router.location.pathname !== '/search'){
          setTimeout(() => {
            dispatch(pushState(null, `/search?s=${string}`));
          }, 40);
        }else {
          setTimeout(() => {
            dispatch(replaceState(null, `/search?s=${string}`));
          }, 40);
        }
        return resolve(string);
      })
    });
  };
}

export function setTokens(payloadTokens = []){
  return (dispatch, state) => {
    dispatch({
      type: SEARCH_SET_TOKENS,
      payload: new Promise((resolve) => {
        const oldTokens = state().search.tokens;
        const combined = _.chain([].concat(payloadTokens, oldTokens)).uniq(token => {
          if (token.tag){
            return token.tag + token.term;
          }
          return token.term;
        }).reject('remove').value();
        const string = stringFromTokens(combined);
        dispatch({
          type: SEARCH_SET_STRING,
          payload: string
        });
        if (state().router.location.pathname !== '/search'){
          setTimeout(() => {
            dispatch(pushState(null, `/search?s=${string}`));
          }, 40);
        }else {
          setTimeout(() => {
            dispatch(replaceState(null, `/search?s=${string}`));
          }, 40);
        }
        return resolve(true);
      })
    });
  };
}