import _ from 'lodash';
import config from '../modules/config';
import Flux from '../modules/flux';
import request from '../modules/request';
import {UserStore} from '../stores';

let _actions = {};

_actions.checkSilence = Flux.statics.addAction('checkSilence');

_actions.checkCreate = Flux.statics.addAsyncAction('checkCreate',
  (data) => {
    const disallowed = ['assertions', 'notifications', 'instances', 'health', 'state', 'silenceDate', 'silenceDuration'];
    data = _.omit(data, disallowed);
    return request
    .post(`${config.api}/checks`)
    .set('Authorization', UserStore.getAuth())
    .send(data);
  },
  res => res.body,
  res => res && res.body || res
);

_actions.getCheck = Flux.statics.addAsyncAction('getCheck',
  (id) => {
    return request
    .get(`${config.api}/checks/${id}`)
    .set('Authorization', UserStore.getAuth())
  },
  res => res.body,
  res => res && res.body
);

_actions.deleteCheck = Flux.statics.addAsyncAction('deleteCheck',
  (id) => {
    return request
    .del(`${config.api}/checks/${id}`)
    .set('Authorization', UserStore.getAuth())
  },
  res => res.body,
  res => res && res.body
);

_actions.getChecks = Flux.statics.addAsyncAction('getChecks',
  (id) => {
    return request
    .get(`${config.api}/checks`)
    .set('Authorization', UserStore.getAuth())
  },
  res => res.body,
  res => res && res.body
);

// _actions.checkCreate = Flux.statics.addAsyncAction('checkCreate',
//   (data) => {
//     return api.postChecks({Check:data});
//   },
//   res => res.body,
//   res => res && res.body || res
// );

export default _.assign({}, ..._.values(_actions));