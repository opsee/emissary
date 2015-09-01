import config from '../modules/config';
import Flux from '../modules/flux';
import request from '../modules/request';
import {UserStore} from '../stores';
import _ from 'lodash';
import {auth} from '../swagger';

var getSignups = Flux.statics.addAsyncAction('getSignups', 
  (id) => {
    return auth.listSignups();
    return request
    .get(`${config.authApi}/signups`)
    .set('Authorization', UserStore.getAuth())
  },
  res => res && res.body,
  res => res && res.response
);

var activateSignup = Flux.statics.addAsyncAction('activateSignup', 
  (signup) => {
    return request
    .put(`${config.authApi}/signups/${signup.id}/activate`)
    .set('Authorization', UserStore.getAuth())
  },
  res => res && res.body,
  res => res && res.response
);

export default _.assign({}, getSignups, activateSignup);