import {List, Record, Map} from 'immutable';
import _ from 'lodash';
import moment from 'moment';
import checkStats from './checkStats';

const OuterResponse = Record({
  passing: undefined,
  response: undefined,
  target: new Map(),
  error: undefined,
  bastion_id: undefined
});

const InnerResponse = Record({
  body: undefined,
  code: undefined,
  headers: List(),
  metrics: List()
});

const Result = Record({
  host: undefined,
  passing: undefined,
  responses: List(),
  timestamp: undefined,
  bastion_id: undefined
});

function resultFromJS(data){
  let newData = {};
  let results = _.cloneDeep(data.results);
  if (results && results.length){
    let newResults = results.map(result => {
      const responses = new List(result.responses.map(r => {
        let d = _.cloneDeep(r);
        d.response = new InnerResponse(r.reply);
        d.target = new Map(r.target);
        return new OuterResponse(d);
      }));
      return new Result(_.assign({}, result, {responses}));
    });
    if (newResults && newResults.length){
      newData.results = new List(newResults);
    }
  }
  return newData.results;
}

export default {
  getFormattedData(data, state){
    let obj = {
      passing: undefined,
      total: undefined,
      health: undefined,
      results: resultFromJS(data) || new List()
    };
    if (obj.results && obj.results.size && obj.results.get(0)){
      let boolArray = _.chain(obj.results.toJS()).map('responses').flatten().map('passing').value();
      const passing = _.compact(boolArray);
      const health = Math.floor((passing.length / boolArray.length) * 100);
      obj = _.assign(obj, {
        passing: passing.length,
        total: boolArray.length,
        health,
        state: health === 100 ? 'passing' : 'failing'
      })
      const d = moment.unix(obj.results.toJS()[0].time).toDate();
      if (_.isDate(d)){
        obj.lastChecked = d;
      }
    }
    if (data.state_transitions){
      const stats = _.assign(checkStats(data.state_transitions, obj.state), {period: state.startHours});
      obj = _.assign(obj, {stats});
    }
    return obj;
  }
};