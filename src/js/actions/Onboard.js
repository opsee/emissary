import constants from '../constants';
import Flux from '../Flux';
import request from '../request';
import _ from 'lodash';

const signupCreate = Flux.statics.addAsyncAction('signupCreate',
  (data) => {
    return request
    .post(`${constants.api}/signups`)
    .send(data)
  },
  res => res && res.body,
  res => res && res.response
);

const setPassword = Flux.statics.addAsyncAction('setPassword',
  (data) => {
    return request
    .post(`${constants.api}/activations/${data.token}/activate`)
    .send(data)
  },
  res => res && res.body,
  res => res && res.response
);

export default _.assign({}, signupCreate, setPassword);