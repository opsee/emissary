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

export default {
  fromJS(data){
    if (data && data.responses){
      let resultData = _.cloneDeep(data);
      resultData.responses = new List(data.responses.map(response => {
        let newData = _.cloneDeep(response);
        newData.response = new InnerResponse(response.response);
        return new OuterResponse(newData);
      }));
      return new Result(resultData);
    }
    return new Result();
  }
};