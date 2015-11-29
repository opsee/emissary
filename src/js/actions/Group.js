import config from '../modules/config';
import Flux from '../modules/flux';
import request from '../modules/request';
import _ from 'lodash';
import storage from '../modules/storage';

let _actions = {};

_actions.getGroupsSecurity = Flux.statics.addAsyncAction('getGroupsSecurity',
  () => {
    return request
    .get(`${config.api}/groups/security`)
    .set('Authorization', storage.get('user').auth);
  },
  res => res.body && res.body.groups,
  res => res && res.response
);

_actions.getGroupsSecurity = Flux.statics.addAsyncAction('getGroupsSecurity',
  () => {
    return new Promise((resolve, reject) => {
      return request
      .get(`${config.api}/groups/security`)
      .set('Authorization', storage.get('user').auth).then(res => {
        request
        .get(`${config.api}/checks`)
        .set('Authorization', storage.get('user').auth).then(checkRes => {
          let groups = res.body.groups;
          let checks = _.get(checkRes, 'body.checks');
          if (checks && checks.length){
            groups = groups.map(data => {
              let group = _.cloneDeep(data);
              group.group.checks = _.filter(checks, c => {
                return c.target.id === group.group.GroupId;
              });
              return group;
            });
          }
          resolve(groups);
        }, reject);
      }, reject);
    });
  },
  groups => groups,
  res => res && res.response
);

_actions.getGroupSecurity = Flux.statics.addAsyncAction('getGroupSecurity',
  (id) => {
    return new Promise((resolve, reject) => {
      request
      .get(`${config.api}/groups/security`)
      .set('Authorization', storage.get('user').auth).then((res) => {
        let group = res.body && res.body.groups && _.find(res.body.groups, (g) => {
          return g.group.GroupId === id;
        });
        request
        .get(`${config.api}/groups/security/${id}`)
        .set('Authorization', storage.get('user').auth).then((res2) => {
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
    .set('Authorization', storage.get('user').auth);
  },
  res => res.body && res.body.groups,
  res => res && res.response
);

_actions.getGroupRDSSecurity = Flux.statics.addAsyncAction('getGroupRDSSecurity',
  (id) => {
    return request
    .get(`${config.api}/groups/rds-security/${id}`)
    .set('Authorization', storage.get('user').auth);
  },
  res => res.body,
  res => res && res.response
);

_actions.getGroupsELB = Flux.statics.addAsyncAction('getGroupsELB',
  () => {
    return new Promise((resolve, reject) => {
      return request
      .get(`${config.api}/groups/elb`)
      .set('Authorization', storage.get('user').auth).then(res => {
        request
        .get(`${config.api}/checks`)
        .set('Authorization', storage.get('user').auth).then(checkRes => {
          let groups = res.body.groups;
          let checks = _.get(checkRes, 'body.checks');
          if (checks && checks.length){
            groups = groups.map(data => {
              let group = _.cloneDeep(data);
              group.group.checks = _.filter(checks, c => {
                return c.target.id === group.group.LoadBalancerName;
              });
              return group;
            });
          }
          resolve(groups);
        }, reject);
      }, reject);
    });
  },
  groups => groups,
  res => res && res.response
);

_actions.getGroupELB = Flux.statics.addAsyncAction('getGroupELB',
  (id) => {
    return new Promise((resolve, reject) => {
      request
      .get(`${config.api}/groups/elb`)
      .set('Authorization', storage.get('user').auth).then((res) => {
        let group = res.body && res.body.groups && _.find(res.body.groups, (g) => {
          return g.group.LoadBalancerName === id;
        });
        request
        .get(`${config.api}/groups/elb/${id}`)
        .set('Authorization', storage.get('user').auth).then((res2) => {
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