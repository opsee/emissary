import _ from 'lodash';
import {handleActions} from 'redux-actions';
import * as constants from '../reduxactions/constants';

export default function asyncActions(state, action = {type: null}) {
  if(typeof action.type === 'string' && action.type.match('_ASYNC$')){
    console.log(action);
    const stripped = _.camelCase(action.type.replace(/_ASYNC$/, ''));
    let obj = {};
    obj[stripped] = action.payload;
    return _.assign({}, state, obj);
  }
  let initial = {};
  _.keys(constants).forEach(c => {
     const name = _.camelCase(c.replace(/_ASYNC$/, ''));
    initial[name] = {
      status: null
    }
  });
  return _.assign({}, state, initial);
};