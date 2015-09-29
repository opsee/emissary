import _ from 'lodash';
import config from '../modules/config';
import Flux from '../modules/flux';
import request from '../modules/request';
import {UserStore} from '../stores';

let _actions = {};

_actions.checkSilence = Flux.statics.addAction('checkSilence');

function formatCheckData(data){
  const disallowed = ['assertions', 'notifications', 'instances', 'health', 'state', 'silenceDate', 'silenceDuration', 'id'];
  return _.omit(data, disallowed);
}

_actions.checkCreate = Flux.statics.addAsyncAction('checkCreate',
  (data) => {
    const d = formatCheckData(data);
    return request
    .post(`${config.api}/checks`)
    .set('Authorization', UserStore.getAuth())
    .send(d);
  },
  res => res.body,
  res => res && res.body || res
);

_actions.checkEdit = Flux.statics.addAsyncAction('checkEdit',
  (data) => {
    const d = formatCheckData(data);
    return request
    .put(`${config.api}/checks/${data.id}`)
    .set('Authorization', UserStore.getAuth())
    .send(d);
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
  res => _.get(res.body) || res
);

_actions.deleteCheck = Flux.statics.addAsyncAction('deleteCheck',
  (id) => {
    return request
    .del(`${config.api}/checks/${id}`)
    .set('Authorization', UserStore.getAuth())
  },
  res => res.body,
  res => _.get(res.body) || res
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

_actions.testCheck = Flux.statics.addAsyncAction('testCheck',
  (data) => {
    const d = formatCheckData(data);
    return request
    .post(`${config.api}/bastions/test-check`)
    .set('Authorization', UserStore.getAuth())
    .send({check:d})
  },
  res => res.body,
  res => res && res.body
);

export default _.assign({}, ..._.values(_actions));