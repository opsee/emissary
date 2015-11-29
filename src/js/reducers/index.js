import {combineReducers} from 'redux';
import {routerStateReducer} from 'redux-router';
import user from './user';
import asyncActions from './asyncActions';
import app from './app';
import env from './env';

const rootReducer = combineReducers({
  router: routerStateReducer,
  user,
  asyncActions,
  app,
  env
});

export default rootReducer;