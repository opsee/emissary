import {List, Record} from 'immutable';
import _ from 'lodash';

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
  responses: List()
});

function fromJS(data){
  let newData = {};
  const resultArray = data.results || data.result;
  const results = Array.isArray(resultArray) ? resultArray : [resultArray];
  if (resultArray && results.length){
    newData.results = new List(results.map(result => {
      if (result && result.responses){
        let resultData = _.cloneDeep(result);
        resultData.responses = new List(result.responses.map(response => {
          let d = _.cloneDeep(response);
          d.response = new InnerResponse(response.response);
          return new OuterResponse(d);
        }));
        return new Result(resultData);
      }
    }));
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
    }
    return obj;
  }
};