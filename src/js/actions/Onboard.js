import Constants from '../Constants';
import Flux from '../Flux';
import request from '../request';
import _ from 'lodash';

var signupCreate = Flux.statics.addAsyncAction('signupCreate',
  (data) => {
    return request
    .post(`${Constants.api}/signups`)
    .send(data)
  },
  res => res && res.body,
  res => res && res.response
);

export default _.assign({}, signupCreate) 