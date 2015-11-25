import {combineReducers} from 'redux';
import {routerStateReducer} from 'redux-router';
import counter from './counter';
import user from './user';
import asyncActions from './asyncActions';

const rootReducer = combineReducers({
  router: routerStateReducer,
  counter,
  user,
  asyncActions
});

export default rootReducer;