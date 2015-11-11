import {List, Record} from 'immutable';
import _ from 'lodash';
import moment from 'moment';

const OuterResponse = Record({
  check_id: undefined,
  passing: undefined,
  response: undefined
});

const InnerResponse = Record({
  type_url: undefined,
  value: Record({
    body: undefined,
    code: undefined,
    headers: List(),
    metrics: List()
  })
});

const Result = Record({
  check_id: undefined,
  host: undefined,
  passing: undefined,
  responses: List(),
  time: undefined
});

function fromJS(data){
  let newData = {};
  const results = data.results || data.result;
  const resultsArray = Array.isArray(results) ? results : [results];
  if (results && resultsArray.length){
    let newResults = resultsArray.map(result => {
      let responses = result.responses || result.response;
      responses = Array.isArray(responses) ? responses : [responses];
      if (responses && responses.length){
        let resultData = _.cloneDeep(result);
        resultData.responses = new List(responses.map(r => {
          let d = _.cloneDeep(r);
          d.response = new InnerResponse(r.response);
          return new OuterResponse(d);
        }));
        return new Result(resultData);
      }
    });
    newResults = _.compact(newResults);
    if (newResults && newResults.length){
      newData.results = new List(newResults);
    }
  }
  return newData;
}

export default {
  getFormattedData(data){
    let obj = {
      passing: undefined,
      total: undefined,
      health: undefined,
      results: fromJS(data).results || new List()
    };
    if (obj.results && obj.results.size){
      const boolArray = _.chain(obj.results.toJS()).pluck('responses').flatten().pluck('passing').value();
      const passing = _.compact(boolArray);
      obj.passing = passing.length;
      obj.total = boolArray.length;
      obj.health = Math.floor((passing.length / boolArray.length) * 100);
      obj.state = obj.health === 100 ? 'passing' : 'failing';
      const d = moment.unix(obj.results.toJS()[0].time).toDate();
      if (_.isDate(d)){
        obj.lastChecked = d;
      }
    }
    return obj;
  }
};