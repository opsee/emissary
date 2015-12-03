import _ from 'lodash';
import {List} from 'immutable';
import result from '../modules/result';
// import exampleGroupsElb from '../examples/groupsElb';
import {handleActions} from 'redux-actions';
import {Check} from '../modules/schemas';

/* eslint-disable no-use-before-define */

const statics = {
  checkFromJS(data){
    const legit = data.instance || data;
    let newData = _.assign({}, legit, legit.check_spec.value);
    newData.name = newData.name || newData.check_spec.value.name;
    newData.check_spec.value.headers = newData.check_spec.value.headers || [];
    _.assign(newData, result.getFormattedData(data));
    return new Check(newData);
  }
};

const initial = {
  checks: new List()
};

export default handleActions({
  GET_CHECK: {
    next(state, action){
      const single = statics.checkFromJS(action.payload);
      let checks;
      const index = state.findIndex(item => {
        return item.get('id') === single.get('id');
      });
      if (index > -1){
        checks = state.checks.update(index, () => single);
      }else {
        checks = state.checks.concat(new List([single]));
      }
      return _.assign({}, state, {checks});
    },
    throw(state){
      return state;
    }
  },
  GET_CHECKS: {
    next(state, action){
      const checks = new List(action.payload.map(c => {
        return statics.checkFromJS(c);
      }));
      return _.assign({}, state, {checks});
    },
    throw(state){
      return state;
    }
  }
}, initial);