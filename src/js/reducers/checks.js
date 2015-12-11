import _ from 'lodash';
import Immutable, {List} from 'immutable';
import result from '../modules/result';
// import exampleGroupsElb from '../examples/groupsElb';
import {handleActions} from 'redux-actions';
import {Check} from '../modules/schemas';
import {
  GET_CHECK,
  GET_CHECKS,
  CHECK_TEST,
  CHECK_TEST_SELECT_RESPONSE
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
    // let response = _.cloneDeep(singleResponse);
    // if(response.toJS){
    //   response = response.toJS();
    // }
    // return {error: 'Something went wrong'};
    let response = singleResponse.toJS();
    if (_.get(response, 'response.value')){
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
    if (response.error){
      return {error: response.error};
    }
    return {error: 'Something went wrong'};
  },
  getFormattedResponses(data){
    return data.map(d => statics.formatResponse(d)).toJS();
  }
};

const initial = {
  checks: new List(),
  responses: new List(),
  responsesFormatted: [],
  selectedResponse: 0
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
      const responses = single.get('results').get(0).get('responses');
      const responsesFormatted = statics.getFormattedResponses(responses);
      return _.assign({}, state, {
        checks,
        responses,
        responsesFormatted
      });
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
      let responses = action.payload.responses ? action.payload.responses : action.payload;
      responses = Immutable.fromJS(responses);
      const responsesFormatted = statics.getFormattedResponses(responses);
      return _.assign({}, state, {responses, responsesFormatted});
    }
  },
  [CHECK_TEST_SELECT_RESPONSE]: {
    next(state, action){
      const selectedResponse = action.payload;
      return _.assign({}, state, {selectedResponse});
    }
  }
}, initial);