import {List} from 'immutable';
import _ from 'lodash';
import {handleActions} from 'redux-actions';
import {yeller} from '../modules';
import {
  ADMIN_GET_SIGNUPS,
  ADMIN_GET_USERS,
  ADMIN_ACTIVATE_SIGNUP
} from '../actions/constants';

let initial = {
  signups: new List(),
  users: new List()
};

export default handleActions({
  [ADMIN_GET_SIGNUPS]: {
    next(state, action){
      return _.assign({}, state, {signups: new List(action.payload)});
    },
    throw: yeller.reportAction
  },
  [ADMIN_GET_USERS]: {
    next(state, action){
      return _.assign({}, state, {users: new List(action.payload)});
    },
    throw: yeller.reportAction
  },
  [ADMIN_ACTIVATE_SIGNUP]: {
    next(state){
      return state;
    },
    throw: yeller.reportAction
  }
}, initial);