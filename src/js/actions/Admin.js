import config from '../modules/config';
import Flux from '../modules/flux';
import request from '../modules/request';
import {UserStore} from '../stores';
import _ from 'lodash';

let _actions = {};

_actions.adminGetSignups = Flux.statics.addAsyncAction('adminGetSignups', 
  (id) => {
    return request
    .get(`${config.authApi}/signups`)
    .set('Authorization', UserStore.getAuth())
  },
  res => res && res.body,
  res => res && res.response
);

_actions.adminActivateSignup = Flux.statics.addAsyncAction('adminActivateSignup', 
  (signup) => {
    return request
    .put(`${config.authApi}/signups/${signup.id}/activate`)
    .set('Authorization', UserStore.getAuth())
  },
  res => res && res.body,
  res => res && res.response
);

export default _.assign({}, ..._.values(_actions));