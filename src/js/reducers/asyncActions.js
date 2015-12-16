import _ from 'lodash';
import * as constants from '../actions/constants';

export default function asyncActions(state, action = {type: null}) {
  let initial = {};
  _.keys(constants).forEach(c => {
    const name = _.camelCase(c.replace(/_ASYNC$/, ''));
    initial[name] = {
      status: null
    };
  });
  if (typeof state  === 'undefined'){
    return initial;
  }
  if (typeof action.type === 'string' && action.type.match('_ASYNC$')){
    const stripped = _.camelCase(action.type.replace(/_ASYNC$/, ''));
    let obj = {};
    obj[stripped] = action.payload;
    return _.assign({}, state, obj);
  }
  return state;
}