import config from '../modules/config';
import Flux from '../modules/flux';
import request from '../modules/request';
import _ from 'lodash';
import {auth} from '../swagger';

let _actions = {};

// _actions.userLogin = Flux.statics.addAsyncAction('userLogin',
//   (data) => {
//     return request
//     .post(`${config.api}/authenticate/password`)
//     .send(data)
//   },
//   res => res.body && res.body,
//   res => res && res.response
// );

_actions.userLogin = Flux.statics.addAsyncAction('userLogin',
  (data) => {
    // return auth.authenticateFromPassword(data);
    return request
    .post(`${config.authApi}/authenticate/password`)
    .send(data)
  },
  res => res && res.body,
  res => res && res.response
);

_actions.userSendResetEmail = Flux.statics.addAsyncAction('userSendResetEmail',
  (data) => {
    return request
    .post(`${config.auth0}/dbconnections/change_password`)
    .send(_.extend(data, {
      connection:'Username-Password-Authentication'
    }))
  },
  res => res.body && res.body,
  res => res && res.response
);

_actions.userLogOut = Flux.statics.addAction('userLogOut');

export default _.assign({}, ..._.values(_actions));