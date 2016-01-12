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
        let newTokens = oldTokens.map(oldToken => {
          const {tag} = oldToken;
          const found = _.find(payloadTokens, {tag});
          return found || oldToken;
        });
        const combined = _.uniq([].concat(payloadTokens, newTokens), token => {
          return token.tag || token.term;
        });
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