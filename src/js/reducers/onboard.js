import storage from '../modules/storage';
import {Record} from 'immutable';
import _ from 'lodash';
import {handleActions} from 'redux-actions';
import moment from 'moment';
import config from '../modules/config';

const initial = {
  'access-key': undefined,
  'secret-key': undefined,
  vpcs: [],
  region: undefined,
  bastionLaunching: undefined
}

export default handleActions({
  ONBOARD_SET_REGION: {
    next(state, action){
      return _.assign({}, state, action.payload);
    }
  },
  ONBOARD_SET_CREDENTIALS: {
    next(state, action){
      return _.assign({}, state, action.payload);
    }
  },
  ONBOARD_SET_VPCS: {
    next(state, action){
      return _.assign({}, state, action.payload);
    }
  },
  ONBOARD_GET_BASTION_LAUNCH_STATUS: {
    next(state, action){
      return _.assign({}, state, {bastionLaunching: action.payload});
    }
  }
}, initial);