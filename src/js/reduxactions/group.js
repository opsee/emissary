import {pushState} from 'redux-router';
import config from '../modules/config';
import request from '../modules/request';
import _ from 'lodash';
import analytics from '../modules/analytics';
import {createAction} from 'redux-actions';
import storage from '../modules/storage';
import {
  GET_GROUP_SECURITY,
  GET_GROUPS_SECURITY,
  GET_GROUP_RDS,
  GET_GROUPS_RDS,
  GET_GROUP_ELB,
  GET_GROUPS_ELB
} from './constants';

export const getGroupSecurity = createAction(GET_GROUP_SECURITY, (data) => {
  return new Promise((resolve, reject) => {
    request
    .get(`${config.api}/groups/security`)
    .set('Authorization', state().user.get('auth'))
    .then((res) => {
      let group = res.body && res.body.groups && _.find(res.body.groups, (g) => {
        return g.group.GroupId === id;
      });
      request
      .get(`${config.api}/groups/security/${id}`)
      .set('Authorization', state().user.get('auth'))
      .then((res2) => {
        group.instances = res2.body && res2.body.instances;
        resolve(group);
      }, errRes2 => {
        reject(errRes2);
      });
    }, errRes => {
      reject(errRes);
    });
  });
});

export function getGroupsSecurity(data){
  return (dispatch, state) => {
    dispatch({
      type:'GET_GROUPS_SECURITY',
      payload: new Promise((resolve, reject) => {
        return request
        .get(`${config.api}/groups/security`)
        .set('Authorization', state().user.get('auth'))
        .then(res => {
          request
          .get(`${config.api}/checks`)
          .set('Authorization', state().user.get('auth'))
          .then(checkRes => {
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
      })
    })
  }
}

// _actions.getGroupsRDSSecurity = Flux.statics.addAsyncAction('getGroupsRDSSecurity',
//   () => {
//     return request
//     .get(`${config.api}/groups/rds-security`)
//     .set('Authorization', UserStore.getAuth());
//   },
//   res => res.body && res.body.groups,
//   res => res && res.response
// );

// _actions.getGroupRDSSecurity = Flux.statics.addAsyncAction('getGroupRDSSecurity',
//   (id) => {
//     return request
//     .get(`${config.api}/groups/rds-security/${id}`)
//     .set('Authorization', UserStore.getAuth());
//   },
//   res => res.body,
//   res => res && res.response
// );

// _actions.getGroupsELB = Flux.statics.addAsyncAction('getGroupsELB',
//   () => {
//     return new Promise((resolve, reject) => {
//       return request
//       .get(`${config.api}/groups/elb`)
//       .set('Authorization', UserStore.getAuth()).then(res => {
//         request
//         .get(`${config.api}/checks`)
//         .set('Authorization', UserStore.getAuth()).then(checkRes => {
//           let groups = res.body.groups;
//           let checks = _.get(checkRes, 'body.checks');
//           if (checks && checks.length){
//             groups = groups.map(data => {
//               let group = _.cloneDeep(data);
//               group.group.checks = _.filter(checks, c => {
//                 return c.target.id === group.group.LoadBalancerName;
//               });
//               return group;
//             });
//           }
//           resolve(groups);
//         }, reject);
//       }, reject);
//     });
//   },
//   groups => groups,
//   res => res && res.response
// );

// _actions.getGroupELB = Flux.statics.addAsyncAction('getGroupELB',
//   (id) => {
//     return new Promise((resolve, reject) => {
//       request
//       .get(`${config.api}/groups/elb`)
//       .set('Authorization', UserStore.getAuth()).then((res) => {
//         let group = res.body && res.body.groups && _.find(res.body.groups, (g) => {
//           return g.group.LoadBalancerName === id;
//         });
//         request
//         .get(`${config.api}/groups/elb/${id}`)
//         .set('Authorization', UserStore.getAuth()).then((res2) => {
//           group.instances = res2.body && res2.body.instances;
//           resolve(group);
//         }, res2 => reject(res2));
//       }, res => reject(res));
//     });
//   },
//   res => res,
//   res => _.get(res, 'response') || res
// );