import {pushState} from 'redux-router';
import config from '../modules/config';
import request from '../modules/request';
import {createAction} from 'redux-actions';
import * as analytics from './analytics';
import _ from 'lodash';
import graphPromise from '../modules/graphPromise';
import {
  GET_CHECK,
  GET_CHECK_NOTIFICATION,
  GET_CHECKS,
  CHECKS_DELETE,
  CHECK_CREATE,
  CHECK_EDIT,
  CHECK_TEST,
  CHECK_TEST_RESET,
  CHECK_TEST_SELECT_RESPONSE,
  CHECK_CREATE_OR_EDIT
} from './constants';

/**
 * Fetches check data as JSON from the given JSON URI (e.g., an S3 URL).
 * Used by Screenshot.jsx to populate the UI for the screenshot service.
 */
export function getCheckFromURI(jsonURI) {
  return dispatch => {
    dispatch({
      type: GET_CHECK_NOTIFICATION,
      payload: request.get(jsonURI)
        .then(res => {
          return { data: res.body };
        })
    });
  };
}

// export function getCheck(id){
//   return (dispatch, state) => {
//     dispatch({
//       type: GET_CHECK,
//       payload: new Promise((resolve, reject) => {
//         const r1 = request
//         .get(`${config.services.api}/checks/${id}`)
//         .set('Authorization', state().user.get('auth'));

//         const r2 = new Promise((r2resolve) => {
//           request
//           .get(`${config.services.api}/notifications/${id}`)
//           .set('Authorization', state().user.get('auth'))
//           .then(r2resolve, () => {
//             r2resolve({body: {notifications: []}});
//           });
//         });

//         Promise.all([r1, r2]).then((values) => {
//           const check = values[0].body;
//           const {notifications} = values[1].body;
//           const obj = _.assign({}, check, {notifications});
//           resolve({
//             data: obj,
//             search: state().search
//           });
//         }, reject);
//       })
//     });
//   };
// }

export function getCheck(id){
  return (dispatch, state) => {
    dispatch({
      type: GET_CHECK,
      payload: graphPromise('checks', () => {
        return request
        .post(`${config.services.compost}`)
        .set('Authorization', state().user.get('auth'))
        .send({query: 
          `{
              checks (id: "${id}"){
                id
                notifications {
                  value
                  type
                }
                target {
                  address
                  name
                  type
                  id
                }
                name
                last_run
                spec {
                  ... on schemaHttpCheck {
                    verb
                    protocol
                    path
                    port
                    headers {
                      name
                      values
                    }
                  }
                  ... on schemaCloudWatchCheck {
                    metrics {
                      namespace
                      name
                    }
                  }
                }
                results {
                  passing
                  responses {
                    passing
                    reply {
                      ...on schemaHttpResponse {
                        code
                        body
                        headers {
                          name
                          values
                        }
                        metrics {
                          value
                          name
                        }
                        host
                      }
                      ... on schemaCloudWatchResponse {
                        namespace
                        metrics {
                          timestamp
                          unit
                          name
                          value
                        }
                      }
                    }
                    target {
                      id
                      type
                    }
                  }
                }
                assertions {
                  value
                  relationship
                  operand
                  key
                }
              }
            }`
          })
        }, {id, search: state().search})
      })
    }
  }

// export function getChecks(redirect){
//   return (dispatch, state) => {
//     dispatch({
//       type: GET_CHECKS,
//       payload: new Promise((resolve, reject) => {
//         return request
//         .get(`${config.services.api}/checks`)
//         .set('Authorization', state().user.get('auth'))
//         .then(res => {
//           resolve({
//             data: _.get(res.body, 'checks'),
//             search: state().search
//           });
//           if (redirect){
//             setTimeout(() => {
//               dispatch(pushState(null, '/'));
//             }, 30);
//           }
//         }, reject);
//       })
//     });
//   };
// }

export function getChecks(redirect){
  return (dispatch, state) => {
    dispatch({
      type: GET_CHECKS,
      payload: graphPromise('checks', () => {
        return request
        .post(`${config.services.compost}`)
        .set('Authorization', state().user.get('auth'))
        .send({query: `
            {
              checks {
                id
                name
                spec {
                  ... on schemaHttpCheck {
                    verb
                    headers {
                      name
                      values
                    }
                  }
                }
                results {
                  responses {
                    passing
                    target {
                      id
                      type
                    }
                  }
                }
              }
            }`
          })
        }, {search: state().search}, payload => {
          if (redirect){
            setTimeout(() => {
              dispatch(pushState(null, '/'));
            }, 30);
          }
        })
      })
    }
  }


// export function getChecks(redirect){
//   return (dispatch, state) => {
//     dispatch({
//       type: GET_CHECKS,
//       payload: new Promise((resolve, reject) => {
//         return request
//         .post(`${config.services.compost}`)
//         .set('Authorization', state().user.get('auth'))
//         .send({query: `
//             {
//               checks {
//                 id
//               }
//             }
//           `})
//         .then(res => {
//           const errors = _.get(res, 'body.errors');
//           if (Array.isArray(errors) && errors.length){
//             return reject(errors[0]);
//           }
//           return resolve({
//             data: _.get(res, 'body.data'),
//             search: state().search
//           });
//         }, reject);
//       })
//     });
//   };
// }

// export function del(id){
//   return (dispatch, state) => {
//     dispatch({
//       type: CHECK_DELETE,
//       payload: new Promise((resolve, reject) => {
//         return request
//         .del(`${config.services.api}/checks/${id}`)
//         .set('Authorization', state().user.get('auth'))
//         .then(res => {
//           resolve(res.body);
//           getChecks(true)(dispatch, state);
//           analytics.trackEvent('Check', 'delete', id)(dispatch, state);
//         }, reject);
//       })
//     });
//   };
// }

export function del(ids){
  return (dispatch, state) => {
    dispatch({
      type: CHECKS_DELETE,
      payload: graphPromise('checks', () => {
        return request
        .post(`${config.services.compost}`)
        .set('Authorization', state().user.get('auth'))
        .send({query:
          `mutation Mutation {
            deleteChecks(ids: ${JSON.stringify(ids)})
          }`
        })
      }, null, payload => {
        getChecks(true)(dispatch, state);
        analytics.trackEvent('Check', 'delete')(dispatch, state);
      })
    })
  }
}

function getNamespace(type){
  switch (type){
    case 'instance':
      return 'AWS_EC2';
    default:
      return 'AWS_RDS';
  }
}

function formatCloudwatchCheck(data){
  const check = _.pick(data, ['target', 'assertions', 'notifications', 'name', 'cloudwatch_check']);
  const namespace = getNamespace(check.target.type);
  const metrics = check.assertions.map(assertion => {
    return {
      name: assertion.value,
      namespace
    }
  });
  check.cloudwatch_check = {metrics};
  return check;
}

function formatHttpCheck(data){
  let check = _.cloneDeep(data);
  const spec = check.spec;
  if (check.target.type === 'security'){
    check.target.type = 'sg';
  }
  if (check.target.type.match('^EC2$|^ecc$')){
    check.target.type = 'instance';
  }
  let arr = check.assertions || [];
  const assertions = arr.map(a => {
    return _.assign({}, a, {
      operand: typeof a.operand === 'number' ? a.operand.toString() : a.operand
    });
  });
  check.spec.headers = _.filter(spec.headers, h => {
    return h.name && h.values && h.values.length;
  });
  check.spec = _.pick(spec, ['headers', 'path', 'port', 'protocol', 'verb', 'body']);
  return _.assign({}, _.pick(check, ['target', 'interval', 'spec', 'name']), {
    assertions
  });
}

function formatCheckData(check){
  //TODO switch this to be more flexible
  if (check.target.type === 'rds'){
    return formatCloudwatchCheck(check);
  }
  return formatHttpCheck(check);
}

export function test(data){
  return (dispatch, state) => {
    dispatch({
      type: CHECK_TEST,
      payload: new Promise((resolve, reject) => {
        if (process.env.NODE_ENV !== 'production'){
          // if (data.spec.path.match('jsonassertion')){
          //   return resolve([
          //     {
          //       response: {
          //         type_url: 'HttpResponse',
          //         value: require('../../files/exampleResponseJson')
          //       }
          //     }
          //   ]);
          // }
          if (data.spec.path.match('services\/200')){
            return resolve([
              {
                response: {
                  type_url: 'HttpResponse',
                  value: require('../../files/exampleResponseHtml')
                }
              }
            ]);
          }
        }
        const check = _.chain(data)
        .thru(formatCheckData)
        .assign({name: state().user.get('email')})
        .pick(['spec', 'interval', 'name', 'target'])
        .value();
        return request
        .post(`${config.services.api}/bastions/test-check`)
        .set('Authorization', state().user.get('auth'))
        .send({check, max_hosts: 3, deadline: '30s'})
        .then(res => {
          const responses = _.get(res, 'body.responses');
          responses ? resolve(responses) : reject(res.body);
        }, reject);
      })
    });
  };
}

export const testCheckReset = createAction(CHECK_TEST_RESET);

export const selectResponse = createAction(CHECK_TEST_SELECT_RESPONSE);

function saveNotifications(state, data, checkId, isEditing){
  //ensure no duplicate notifications
  const notifications = _.uniqBy(data.notifications, n => n.type + n.value);
  return request
  [isEditing ? 'put' : 'post'](`${config.services.api}/notifications${isEditing ? '/' + checkId : ''}`)
  .set('Authorization', state().user.get('auth'))
  .send({
    'check-id': checkId,
    notifications
  });
}

function checkCreateOrEdit(state, data, isEditing){
  return new Promise((resolve, reject) => {
    const d = formatCheckData(data);
    request
    [isEditing ? 'put' : 'post'](`${config.services.api}/checks${isEditing ? '/' + data.id : ''}`)
    .set('Authorization', state().user.get('auth'))
    .send(d).then(checkRes =>{
      saveNotifications(state, data, _.get(checkRes, 'body.id') || data.id, isEditing)
      .then(() => {
        resolve(checkRes);
      }).catch(reject);
    }).catch(reject);
  });
}

// export function create(data){
//   return (dispatch, state) => {
//     dispatch({
//       type: CHECK_CREATE,
//       payload: new Promise((resolve, reject) => {
//         checkCreateOrEdit(state, data)
//         .then(res => {
//           resolve(res.body);
//           analytics.trackEvent('Check', 'create', res.body)(dispatch, state);
//           setTimeout(() => {
//             dispatch(pushState(null, '/'));
//           }, 100);
//         }, reject);
//       })
//     });
//   };
// }

// export function createOrEdit(raw){
//   let data = Array.isArray(raw) ? raw : [raw];
//   const checks = data.map(formatCheckData);
//   return (dispatch, state) => {
//     dispatch({
//       type: CHECK_CREATE_OR_EDIT,
//       payload: new Promise((resolve, reject) => {
//         return request
//         .post(`${config.services.compost}`)
//         .set('Authorization', state().user.get('auth'))
//         .send({query: `
//             mutation Mutation ($checks: [Check]){
//               checks(checks: $checks) {
//                 id
//               }
//             }
//           `,
//             variables: {
//               checks
//             }})
//         .then(res => {
//           const errors = _.get(res, 'body.errors');
//           if (Array.isArray(errors) && errors.length){
//             return reject(errors[0]);
//           }
//           debugger;
//           return resolve({
//             data: _.get(res, 'body.data'),
//             search: state().search
//           });
//         }, reject);
//       })
//     });
//   };
// }

export function createOrEdit(raw){
  let data = Array.isArray(raw) ? raw : [raw];
  const checks = data.map(formatCheckData);
  return (dispatch, state) => {
    dispatch({
      type: CHECK_CREATE_OR_EDIT,
      payload: graphPromise('checks', () => {
        return request
        .post(`${config.services.compost}`)
        .set('Authorization', state().user.get('auth'))
        .send({query: `
          mutation Mutation ($checks: [Check]){
            checks(checks: $checks) {
              id
            }
          }
        `,
          variables: {
            checks
          }})
        }, null, (payload) => {
          analytics.trackEvent('Check', 'create')(dispatch, state);
          const id = _.chain(payload).get('data').thru(arr => arr || []).head().get('id').value();
          const redirect = id ? `/check/${id}` : '/';
          setTimeout(() => {
            dispatch(pushState(null, redirect));
          }, 100);
        })
      })
    }
  }

export function create(data){
  return (dispatch, state) => {
    dispatch({
      type: CHECK_CREATE,
      payload: new Promise((resolve, reject) => {
        checkCreateOrEdit(state, data)
        .then(res => {
          resolve(res.body);
          analytics.trackEvent('Check', 'create', res.body)(dispatch, state);
          setTimeout(() => {
            dispatch(pushState(null, '/'));
          }, 100);
        }, reject);
      })
    });
  };
}

export function edit(data){
  return (dispatch, state) => {
    dispatch({
      type: CHECK_EDIT,
      payload: new Promise((resolve, reject) => {
        checkCreateOrEdit(state, data, true)
        .then(res => {
          resolve(res.body);
          analytics.trackEvent('Check', 'edit', res.body)(dispatch, state);
          setTimeout(() => {
            dispatch(pushState(null, '/'));
          }, 100);
        }, reject);
      })
    });
  };
}