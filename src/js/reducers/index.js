import {combineReducers} from 'redux';
import {routerStateReducer as router} from 'redux-router';
import user from './user';
import asyncActions from './asyncActions';
import app from './app';
import env from './env';
import onboard from './onboard';

export default combineReducers({
  app,
  asyncActions,
  env,
  onboard,
  router,
  user
});