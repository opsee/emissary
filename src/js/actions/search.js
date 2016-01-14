import {pushState, replaceState} from 'redux-router';
import _ from 'lodash';
import {stringFromTokens} from '../modules';
import tokenizer from 'search-text-tokenizer';

import {
  SEARCH_SET_STRING,
  SEARCH_SET_TOKENS,
  ENV_SET_FILTERED,
  CHECKS_SET_FILTERED
} from './constants';

export function setString(string){
  return (dispatch, state) => {
    dispatch({
      type: SEARCH_SET_STRING,
      payload: new Promise((resolve) => {
        if (state().router.location.pathname !== '/search'){
          dispatch(pushState(null, `/search?s=${string}`));
        }else {
          dispatch(replaceState(null, `/search?s=${string}`));
        }
        resolve(string);
        const tokens = tokenizer(string);
        dispatch({
          type: ENV_SET_FILTERED,
          payload: {string, tokens}
        });
        dispatch({
          type: CHECKS_SET_FILTERED,
          payload: {string, tokens}
        });
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
        const tokens = _.chain([].concat(payloadTokens, oldTokens)).uniq(token => {
          if (token.tag){
            return token.tag + token.term;
          }
          return token.term;
        }).reject('remove').value();
        const string = stringFromTokens(tokens);
        dispatch({
          type: SEARCH_SET_STRING,
          payload: string
        });
        dispatch({
          type: ENV_SET_FILTERED,
          payload: {string, tokens}
        });
        dispatch({
          type: CHECKS_SET_FILTERED,
          payload: {string, tokens}
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