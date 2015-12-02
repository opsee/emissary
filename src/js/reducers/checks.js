import _ from 'lodash';
import {Record, List, Map} from 'immutable';
import result from '../modules/result';
// import exampleGroupsElb from '../examples/groupsElb';
import {handleActions} from 'redux-actions';

/* eslint-disable no-use-before-define */

const Target = Record({
  name: undefined,
  type: 'sg',
  id: undefined
});

const Check = Record({
  id: undefined,
  name: undefined,
  target: Target(),
  assertions: List([
    {
      key: 'code',
      operand: 200,
      relationship: 'equal'
    }
  ]),
  notifications: List(),
  instances: List(),
  health: undefined,
  state: 'initializing',
  silenceDate: undefined,
  silenceDuration: undefined,
  interval: 30,
  results: List(),
  passing: undefined,
  total: undefined,
  check_spec: Map({
    type_url: 'HttpCheck',
    value: Map({
      name: undefined,
      path: undefined,
      protocol: 'http',
      port: undefined,
      verb: undefined,
      body: undefined,
      headers: new List()
    })
  })
});
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

const initial = new List();

export default handleActions({
  GET_CHECK: {
    next(state, action){
      const single = statics.checkFromJS(action.payload);
      const index = state.findIndex(item => {
        return item.get('id') === single.get('id');
      });
      if (index > -1){
        return state.update(index, () => single);
      }
      return state.concat(new List([single]));
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
      return checks;
    },
    throw(state){
      return state;
    }
  }
}, initial);