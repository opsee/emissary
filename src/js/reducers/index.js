import {combineReducers} from 'redux';
import {routerStateReducer as router} from 'redux-router';
import app from './app';
import asyncActions from './asyncActions';
import checks from './checks';
import env from './env';
import onboard from './onboard';
import user from './user';

export default combineReducers({
  app,
  asyncActions,
  checks,
  env,
  onboard,
  router,
  user
});