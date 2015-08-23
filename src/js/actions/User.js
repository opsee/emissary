import constants from '../constants';
import Flux from '../Flux';
import request from '../request';
import _ from 'lodash';
import UserStore from '../stores/User';

let _actions = {};

// _actions.userLogin = Flux.statics.addAsyncAction('userLogin',
//   (data) => {
//     return request
//     .post(`${constants.api}/authenticate/password`)
//     .send({email:data.username, password:data.password})
//   },
//   res => res.body && res.body,
//   res => res && res.response
// );

_actions.userLogin = Flux.statics.addAsyncAction('userLogin',
  (data) => {
    return request
    .post(`https://opsee.auth0.com/oauth/ro`)
    .send(_.extend({
      connection:'Username-Password-Authentication',
      client_id:'6mENzKCedkgHF99YHLxhJUT1S2GZPvTJ',
      scope:'openid username email'
      }, data)
    )
  },
  res => res.body && res.body,
  res => res && res.response
);

_actions.userGetProfile = Flux.statics.addAsyncAction('userGetProfile',
  (data) => {
    return request
    .get(`https://opsee.auth0.com/userinfo`)
    .set('Authorization', `Bearer ${data.access_token}`)
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