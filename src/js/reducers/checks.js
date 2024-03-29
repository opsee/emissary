import _ from 'lodash';
import {fromJS, List, Map} from 'immutable';
import {parse} from 'query-string';
import result from '../modules/result';
import {handleActions} from 'redux-actions';
import {Check, CheckEvent} from '../modules/schemas';
import {config, itemsFilter, yeller} from '../modules';
import {
  GET_CHECK,
  GET_CHECK_FROM_S3,
  GET_CHECKS,
  CHECK_TEST,
  CHECK_TEST_RESET,
  CHECK_TEST_SELECT_RESPONSE,
  CHECKS_SET_FILTERED,
  CHECK_SELECT_TOGGLE,
  GET_CHECKS_NOTIFICATIONS,
  CHECKS_DELETE,
  CHECKS_DELETE_PENDING
} from '../actions/constants';

/* eslint-disable no-use-before-define */

export const statics = {
  checkFromJS(data, state){
    let checkState = 'passing';
    switch (data.state){
    case 'INITIALIZING':
      checkState = 'initializing';
      break;
    case 'FAIL':
      checkState = 'failing';
      break;
    case 'FAIL_WAIT':
    case 'PASS_WAIT':
      checkState = 'warning';
      break;
    default:
      break;
    }
    let target = data.target;
    if (target.type.match('ecs')){
      let stringArr = (target.id || '').split('/');
      if (stringArr.length === 4){
        target = _.assign(target, {
          cluster: stringArr[0],
          service: stringArr[1],
          container: stringArr[2],
          containerPort: _.parseInt(stringArr[3], 10)
        });
      }
    }
    const newData = _.assign({}, data, result.getFormattedData(data, true), {
      selected: !!state.checks.find(check => {
        return (check.get('id') === data.id) && (check.get('selected'));
      }),
      state: checkState,
      target: new Map(target),
      assertions: new List(data.assertions),
      type: !!_.get(data, 'spec.metrics') ? 'cloudwatch' : 'http'
    });
    return new Check(newData);
  },
  checksFromJS(data, state){
    return new List(data.map(c => {
      return statics.checkFromJS(c, state);
    }));
  },
  formatResponse(item){
    let data = _.cloneDeep(item.toJS());
    if (_.get(data, 'response')){
      const headers = _.get(data, 'response.headers');
      if (headers){
        data.response.headers = headers.map(h => {
          h.values = h.values.join(', ');
          return h;
        });
        let headerObj = {};
        data.response.headers.forEach(h => {
          headerObj[h.name] = h.values;
        });
        data.response.headers = headerObj;
        const contentType = _.chain(headers).find({name: 'Content-Type'}).get('values').value() || '';
        if (contentType.match(/json/i)){
          try {
            data.response.body = JSON.parse(data.response.body);
            data.response.json = true;
          } catch (err){
            yeller.report(err);
          }
        }
      }
      if (data.error){
        try {
          let err = JSON.parse(data.error);
          if (err && err.error){
            data.error = err.error;
          } else {
            data.error = err;
          }
        } catch (err){
          _.noop();
        }
      }
      // if (!data.error && !_.get(data, 'response.type_url')){
      //   return {error: 'Error in sending the request'};
      // }
      return data;
    }
    if (data.error){
      return data;
    }
    return _.assign(data, {error: 'Something went wrong'});
  },
  getFormattedResponses(data){
    return data.map(d => statics.formatResponse(d)).toJS();
  }
};

let selected = [];
const query = parse(window.location.search);
if (query && query.selected){
  let arr = [];
  try {
    arr = JSON.parse(query.selected);
  } catch (err){
    _.noop();
  }
  selected = arr.map(id => {
    return new Check({
      id,
      selected: true
    });
  });
}

const initial = {
  checks: new List(selected),
  single: new Check(),
  responses: new List(),
  responsesFormatted: [],
  selectedResponse: 0,
  filtered: new List(),
  event: new CheckEvent(),
  notification: new CheckEvent(),
  startHours: config.checkActivityStartHours
};

export default handleActions({
  [GET_CHECK]: {
    next(state, action){
      const single = statics.checkFromJS(_.assign(_.find(action.payload.data, {id: action.payload.id}), {tags: ['complete']}), state);
      let checks;
      const index = state.checks.findIndex(item => {
        return item.get('id') === single.get('id');
      });
      if (index > -1){
        checks = state.checks.update(index, () => single);
      } else {
        checks = state.checks.concat(new List([single]));
      }
      let responses = new List(_.chain(single.toJS()).get('results').map(r => {
        return r.responses.map(res => _.assign(res, {bastion_id: r.bastion_id}));
      }).flatten().map(r => fromJS(r)).value());
      responses = responses && responses.toJS ? responses : new List();
      responses = responses.sortBy(r => {
        return r.passing;
      });
      const responsesFormatted = statics.getFormattedResponses(responses);
      const filtered = itemsFilter(checks, action.payload.search, 'checks');
      const startHours = action.payload.hours;
      return _.assign({}, state, {
        single,
        checks,
        responses,
        responsesFormatted,
        filtered,
        startHours
      });
    },
    throw(state, action){
      yeller.reportAction(state, action);
      return _.assign({}, state, {
        single: new Check(),
        responsesFormatted: []
      });
    }
  },
  [GET_CHECKS]: {
    next(state, action){
      const checks = statics.checksFromJS(action.payload.data, state);
      const filtered = itemsFilter(checks, action.payload.search, 'checks');
      const startHours = action.payload.hours;
      return _.assign({}, state, {checks, filtered, startHours});
    },
    throw: yeller.reportAction
  },
  [GET_CHECKS_NOTIFICATIONS]: {
    next(state, action){
      const checks = new List(action.payload.data.map(c => {
        return statics.checkFromJS(_.assign(c, {tags: ['notifications']}), state);
      }));
      const filtered = itemsFilter(checks, action.payload.search, 'checks');
      return _.assign({}, state, {checks, filtered});
    },
    throw: yeller.reportAction
  },
  [GET_CHECK_FROM_S3]: {
    next(state, action) {
      let {data} = action.payload;
      const hasResponses = _.chain(data)
      .get('responses')
      .map('Reply')
      .map('HttpResponse')
      .some()
      .value();
      if (hasResponses){
        data = _.chain(data)
        .mapValues((value, key) => {
          if (key === 'responses'){
            return value.map(r => {
              const http = _.get(r, 'Reply.HttpResponse');
              if (http){
                return {response: http, target: r.target, passing: !!r.passing};
              }
              return _.assign(r, {error: _.get(r, 'error')});
            });
          }
          return value;
        })
        .value();
      }
      data = _.assign(data, {
        name: data.check_name
      });
      const notification = fromJS(data);
      let responses = notification.get('responses');
      responses = responses && responses.toJS ? responses : new List();
      const responsesFormatted = statics.getFormattedResponses(responses);

      return _.assign({}, state, { notification, responses, responsesFormatted });
    },
    throw: yeller.reportAction
  },
  [CHECK_TEST]: {
    next(state, action){
      let responses = action.payload.data.map(response => {
        return _.mapKeys(response, (value, key) => {
          return key === 'reply' ? 'response' : key;
        });
      });
      responses = fromJS(responses);
      const responsesFormatted = statics.getFormattedResponses(responses);
      return _.assign({}, state, {responses, responsesFormatted});
    },
    throw(state, action){
      yeller.reportAction(state, action);
      return _.assign({}, state, {responses: new List(), responsesFormatted: []});
    }
  },
  [CHECK_TEST_RESET]: {
    next(state){
      return _.assign({}, state, {responses: new List(), responsesFormatted: []});
    }
  },
  [CHECK_TEST_SELECT_RESPONSE]: {
    next(state, action){
      const selectedResponse = action.payload;
      return _.assign({}, state, {selectedResponse});
    }
  },
  [CHECKS_SET_FILTERED]: {
    next(state, action){
      const filtered = itemsFilter(state.checks, action.payload, 'checks');
      return _.assign({}, state, {filtered});
    }
  },
  [CHECK_SELECT_TOGGLE]: {
    next(state, action){
      let checks = state.checks;
      if (action.payload){
        const index = checks.findIndex(item => {
          return item.get('id') === action.payload;
        });
        let updated;
        if (index > -1){
          updated = checks.get(index).set('selected', !checks.get(index).get('selected'));
        }
        checks = updated ? checks.update(index, () => updated) : checks;
      } else {
        const foundSelected = checks.filter(check => {
          return check.get('selected');
        }).size;
        checks = checks.map(check => {
          return check.set('selected', !foundSelected);
        });
      }
      return _.assign({}, state, {
        checks
      });
    }
  },
  [CHECKS_DELETE_PENDING]: {
    next(state, action){
      const deleteIDs = _.get(action.payload, 'ids');
      const checks = state.checks.map(check => {
        let isDeleting = _.includes(deleteIDs, check.get('id'));
        return check.set('deleting', isDeleting);
      });
      return _.assign({}, state, { checks });
    }
  },
  [CHECKS_DELETE]: {
    next(state, action){
      const checks = statics.checksFromJS(action.payload.data, state);
      const filtered = itemsFilter(checks, action.payload.search, 'checks');
      return _.assign({}, state, {checks, filtered});
    },
    throw(state){
      const checks = state.checks.map(check => {
        return check.set('deleting', false);
      });
      return _.assign({}, state, { checks });
    }
  }
}, initial);