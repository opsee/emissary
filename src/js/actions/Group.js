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
    .set('Authorization', UserStore.getAuth());
  },
  res => res.body && res.body.groups,
  res => res && res.response
);

_actions.getGroupSecurity = Flux.statics.addAsyncAction('getGroupSecurity',
  (id) => {
    return new Promise((resolve, reject) => {
      request
      .get(`${config.api}/groups/security`)
      .set('Authorization', UserStore.getAuth()).then((res) => {
        let group = res.body && res.body.groups && _.findWhere(res.body.groups, {GroupId: id});
        request
        .get(`${config.api}/groups/security/${id}`)
        .set('Authorization', UserStore.getAuth()).then((res2) => {
          group.instances = res2.body && res2.body.instances;
          resolve(group);
        }, errRes2 => {
          reject(errRes2);
        });
      }, errRes => {
        reject(errRes);
      });
    });
  },
  res => res,
  res => _.get(res, 'response') || res
);

_actions.getGroupsRDSSecurity = Flux.statics.addAsyncAction('getGroupsRDSSecurity',
  () => {
    return request
    .get(`${config.api}/groups/rds-security`)
    .set('Authorization', UserStore.getAuth());
  },
  res => res.body && res.body.groups,
  res => res && res.response
);

_actions.getGroupRDSSecurity = Flux.statics.addAsyncAction('getGroupRDSSecurity',
  (id) => {
    return request
    .get(`${config.api}/groups/rds-security/${id}`)
    .set('Authorization', UserStore.getAuth());
  },
  res => res.body,
  res => res && res.response
);

_actions.getGroupsELB = Flux.statics.addAsyncAction('getGroupsELB',
  () => {
    return request
    .get(`${config.api}/groups/elb`)
    .set('Authorization', UserStore.getAuth());
  },
  res => res.body && res.body.groups,
  res => res && res.response
);

_actions.getGroupELB = Flux.statics.addAsyncAction('getGroupELB',
  (id) => {
    return new Promise((resolve, reject) => {
      request
      .get(`${config.api}/groups/elb`)
      .set('Authorization', UserStore.getAuth()).then((res) => {
        let group = res.body && res.body.groups && _.findWhere(res.body.groups, {LoadBalancerName: id});
        request
        .get(`${config.api}/groups/elb/${id}`)
        .set('Authorization', UserStore.getAuth()).then((res2) => {
          group.instances = res2.body && res2.body.instances;
          resolve(group);
        }, res2 => reject(res2));
      }, res => reject(res));
    });
  },
  res => res,
  res => _.get(res, 'response') || res
);

export default _.assign({}, ..._.values(_actions));