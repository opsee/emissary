import _ from 'lodash';
import {fromJS, List} from 'immutable';
import {handleActions} from 'redux-actions';
import {
  SEARCH_SET
} from '../actions/constants';

const initial = {
  string: undefined
};

export default handleActions({
  [SEARCH_SET]: {
    next(state, action){
      return _.assign({}, state, {string: action.payload});
    }
  }
}, initial);