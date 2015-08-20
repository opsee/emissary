import constants from '../constants';
import Flux from '../Flux';
import request from '../request';
import _ from 'lodash';

let _actions = {};

_actions.userLogin = Flux.statics.addAsyncAction('userLogin',
  (data) => {
    return request
    .post(`${constants.api}/authenticate/password`)
    .send(data)
  },
  res => res.body && res.body,
  res => res && res.response
);

_actions.userSendResetEmail = Flux.statics.addAsyncAction('userSendResetEmail',
  (data) => {
    return request
    .post(`${constants.api}/authenticate/reset`)
    .send(data)
  },
  res => res.body && res.body,
  res => res && res.response
);

_actions.userLogOut = Flux.statics.addAction('userLogOut');

export default _.assign({}, ..._.values(_actions));