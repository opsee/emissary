import config from '../modules/config';
import Flux from '../modules/flux';
import request from '../modules/request';
import {UserStore} from '../stores';
import _ from 'lodash';

let _actions = {};

_actions.getGroupsSecurity = Flux.statics.addAsyncAction('getGroupsSecurity',
  () => {
    return request
    .get(`${config.api}/groups/security`)
    .set('Authorization', UserStore.getAuth())
  },
  res => res.body && res.body.groups, 
  res => res && res.response
);

_actions.getGroupSecurity = Flux.statics.addAsyncAction('getGroupSecurity',
  (id) => {
    return request
    .get(`${config.api}/group/security/${id}`)
    .set('Authorization', UserStore.getAuth())
  },
  res => res.body,
  res => res && res.response
);

_actions.getGroupsRDSSecurity = Flux.statics.addAsyncAction('getGroupsRDSSecurity',
  () => {
    return request
    .get(`${config.api}/groups/rds-security`)
    .set('Authorization', UserStore.getAuth())
  },
  res => res.body && res.body.groups, 
  res => res && res.response
);

_actions.getGroupRDSSecurity = Flux.statics.addAsyncAction('getGroupRDSSecurity',
  (id) => {
    return request
    .get(`${config.api}/group/rds-security/${id}`)
    .set('Authorization', UserStore.getAuth())
  },
  res => res.body,
  res => res && res.response
);

_actions.getGroupsELB = Flux.statics.addAsyncAction('getGroupsELB',
  () => {
    return request
    .get(`${config.api}/groups/elb`)
    .set('Authorization', UserStore.getAuth())
  },
  res => res.body && res.body.groups, 
  res => res && res.response
);

_actions.getGroupELB = Flux.statics.addAsyncAction('getGroupELB',
  (id) => {
    return request
    .get(`${config.api}/group/elb/${id}`)
    .set('Authorization', UserStore.getAuth())
  },
  res => res.body,
  res => res && res.response
);

export default _.assign({}, ..._.values(_actions));