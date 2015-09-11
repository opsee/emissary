import config from '../modules/config';
import Flux from '../modules/flux';
import request from '../modules/request';
import _ from 'lodash';
import {auth} from '../swagger';
import {UserStore} from '../stores';

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

_actions.userEdit = Flux.statics.addAsyncAction('userEdit',
  (data) => {
    return request
    .put(`${config.authApi}/users/${data.id}`)
    .set('Authorization', UserStore.getAuth())
    .send(data)
  },
  res => res && res.body,
  res => res && res.response
);

_actions.userSendResetEmail = Flux.statics.addAsyncAction('userSendResetEmail',
  (data) => {
    return request
    .post(`${config.authApi}/authenticate/token`)
    .send(data)
  },
  res => res.body && res.body,
  res => res && res.response
);

_actions.userLogOut = Flux.statics.addAction('userLogOut');

_actions.userSet = Flux.statics.addAction('userSet');

export default _.assign({}, ..._.values(_actions));