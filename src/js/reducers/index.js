import {combineReducers} from 'redux';
import {routerStateReducer as router} from 'redux-router';
import app from './app';
import asyncActions from './asyncActions';
import checks from './checks';
import env from './env';
import integrations from './integrations';
import onboard from './onboard';
import search from './search';
import team from './team';
import user from './user';

export default combineReducers({
  app,
  asyncActions,
  checks,
  env,
  integrations,
  onboard,
  router,
  search,
  team,
  user
});