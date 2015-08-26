import config from '../config';
import Flux from '../Flux';
import request from '../request';
import UserStore from '../stores/User';
import _ from 'lodash';

var getSignups = Flux.statics.addAsyncAction('getSignups', 
  (id) => {
    return request
    .get(`${config.api}/signups`)
    .set('Authorization', UserStore.getAuth())
  },
  res => res && res.body,
  res => res && res.response
);

var activateSignup = Flux.statics.addAsyncAction('activateSignup', 
  (signup) => {
    return request
    .post(`${config.api}/signups/send-activation?email=${signup.email}`)
    .set('Authorization', UserStore.getAuth())
    .send({email:signup.email})
  },
  res => res && res.body,
  res => res && res.response
);

export default _.assign({}, getSignups, activateSignup);