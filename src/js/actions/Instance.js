import config from '../modules/config';
import Flux from '../modules/flux';
import request from '../modules/request';
import _ from 'lodash';
import storage from '../modules/storage';

let _actions = {};

_actions.getInstancesRDS = Flux.statics.addAsyncAction('getInstancesRDS',
  () => {
    return request
    .get(`${config.api}/instances/rds`)
    .set('Authorization', storage.get('user').auth);
  },
  res => res.body && res.body.instances,
  res => res && res.response
);

_actions.getInstanceRDS = Flux.statics.addAsyncAction('getInstanceRDS',
  (id) => {
    return request
    .get(`${config.api}/instance/rds/${id}`)
    .set('Authorization', storage.get('user').auth);
  },
  res => res.body,
  res => res && res.response
);

_actions.getInstancesECC = Flux.statics.addAsyncAction('getInstancesECC',
  () => {
    return request
    .get(`${config.api}/instances/ec2`)
    .set('Authorization', storage.get('user').auth);
  },
  res => res.body && res.body.instances,
  res => res && res.response
);

_actions.getInstanceECC = Flux.statics.addAsyncAction('getInstanceECC',
  (id) => {
    return request
    .get(`${config.api}/instances/ec2/${id}`)
    .set('Authorization', storage.get('user').auth);
  },
  res => res.body,
  res => res && res.response
);

_actions.runInstanceAction = Flux.statics.addAction('runInstanceAction');

export default _.assign({}, ..._.values(_actions));