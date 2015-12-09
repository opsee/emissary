import _ from 'lodash';
import Immutable, {List} from 'immutable';
import result from '../modules/result';
// import exampleGroupsElb from '../examples/groupsElb';
import {handleActions} from 'redux-actions';
import {Check} from '../modules/schemas';
import {
  GET_CHECK,
  GET_CHECKS,
  CHECK_TEST
} from '../reduxactions/constants';

/* eslint-disable no-use-before-define */

export const statics = {
  checkFromJS(data){
    const legit = data.instance || data;
    let newData = _.assign({}, legit, legit.check_spec.value);
    newData.name = newData.name || newData.check_spec.value.name;
    newData.check_spec.value.headers = newData.check_spec.value.headers || [];
    _.assign(newData, result.getFormattedData(data));
    return new Check(newData);
  },
  formatResponse(singleResponse){
    if (singleResponse && singleResponse.toJS){
      let response = singleResponse.toJS();
      const headers = _.get(response, 'response.value.headers');
      if (headers){
        response.response.value.headers = headers.map(h => {
          h.values = h.values.join(', ');
          return h;
        });
        let headerObj = {};
        response.response.value.headers.forEach(h => {
          headerObj[h.name] = h.values;
        });
        response.response.value.headers = headerObj;
      }
      if (response.error){
        try {
          let err = JSON.parse(response.error);
          if (err && err.error){
            response.error = err.error;
          }else {
            response.error = err;
          }
        }catch (err){
          _.noop();
        }
      }
      if (!response.error && !_.get(response, 'response.type_url')){
        return {error: 'Error in sending the request'};
      }
      if (_.get(response, 'response.value.metrics')){
        delete response.response.value.metrics;
      }
      return response;
      // return _.omit(response, 'response.value.metrics');
    }
    return {error: 'Something went wrong'};
  },
  getFormattedResponses(data){
    return data.map(d => statics.formatResponse(d)).toJS();
  }
};

const initial = {
  checks: new List(),
  response: undefined,
  responsesFormatted: []
};

export default handleActions({
  [GET_CHECK]: {
    next(state, action){
      const single = statics.checkFromJS(action.payload);
      let checks;
      const index = state.checks.findIndex(item => {
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
  [GET_CHECKS]: {
    next(state, action){
      const checks = new List(action.payload.map(c => {
        return statics.checkFromJS(c);
      }));
      return _.assign({}, state, {checks});
    },
    throw(state){
      return state;
    }
  },
  [CHECK_TEST]: {
    next(state, action){
      const response = Immutable.fromJS(action.payload);
      const responsesFormatted = statics.getFormattedResponses(response);
      return _.assign({}, state, {response, responsesFormatted});
    }
  }
}, initial);