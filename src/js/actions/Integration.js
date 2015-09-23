import config from '../modules/config';
import {UserStore} from '../stores';
import Flux from '../modules/flux';
import request from '../modules/request';
import _ from 'lodash';

let _actions = {};

_actions.getInstancesRDS = Flux.statics.addAsyncAction('getInstancesRDS',
  () => {
    return request
    .get(`${config.api}/instances/rds`)
    .set('Authorization', UserStore.getAuth())
  },
  res => res.body && res.body.instances,
  res => res && res.response
);

// _actions.runInstanceAction = Flux.statics.addAction('runInstanceAction');

export default _.assign({}, ..._.values(_actions));