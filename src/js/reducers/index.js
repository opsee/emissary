import { combineReducers } from 'redux';
import {routerStateReducer} from 'redux-router';
import counter from './counter';
import user from './user';

const rootReducer = combineReducers({
  router: routerStateReducer,
  counter,
  user
});

export default rootReducer;