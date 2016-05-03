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
  CHECK_SELECT_TOGGLE,
  CHECK_MULTIEDIT_NOTIFICATIONS,
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

function getNotifications(state, id){
  return new Promise((resolve, reject) => {
    request
    .get(`${config.services.api}/notifications/${id}`)
    .set('Authorization', state().user.get('auth'))
    .then(resolve, () => {
      resolve({body: {notifications: []}});
    }, reject);
  });
}

export function getCheck(id){
  return (dispatch, state) => {
    dispatch({
      type: GET_CHECK,
      payload: graphPromise('checks', () => {
        return request
        .post(`${config.services.compost}`)
        .set('Authorization', state().user.get('auth'))
        .send({
          query: `{
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
        });
      }, {id, search: state().search})
    });
  };
}

export function getChecks(redirect){
  return (dispatch, state) => {
    dispatch({
      type: GET_CHECKS,
      payload: graphPromise('checks', () => {
        return request
        .post(`${config.services.compost}`)
        .set('Authorization', state().user.get('auth'))
        .send({
          query: `{
            checks {
              id
              name
              target {
                id
                type
              }
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
                passing
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
        });
      }, {search: state().search}, () => {
        if (redirect){
          setTimeout(() => {
            dispatch(pushState(null, '/'));
          }, 30);
        }
      })
    });
  };
}

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
        });
      }, null, () => {
        getChecks(true)(dispatch, state);
        analytics.trackEvent('Check', 'delete')(dispatch, state);
      })
    });
  };
}

function getNamespace(type){
  switch (type){
  case 'instance':
    return 'AWS/EC2';
  default:
    return 'AWS/RDS';
  }
}

function formatCloudwatchCheck(data){
  const check = _.pick(data, ['target', 'assertions', 'notifications', 'name', 'cloudwatch_check', 'id']);
  const namespace = getNamespace(check.target.type);
  const metrics = check.assertions.map(assertion => {
    return {
      name: assertion.value,
      namespace
    };
  });
  check.cloudwatch_check = {metrics};
  check.target.type = check.target.type === 'rds' ? 'dbinstance' : check.target.type;
  check.target = _.pick(check.target, ['id', 'name', 'type']);
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
  check.target = _.pick(check.target, ['id', 'name', 'type']);
  const assertions = (check.assertions || []).map(a => {
    return _.assign({}, a, {
      operand: typeof a.operand === 'number' ? a.operand.toString() : a.operand
    });
  });
  check.spec.headers = _.filter(spec.headers, h => {
    return h.name && h.values && h.values.length;
  });
  check.spec = _.pick(spec, ['headers', 'path', 'port', 'protocol', 'verb', 'body']);
  return _.chain(check)
  .assign({assertions})
  .pick(['target', 'spec', 'name', 'notifications', 'assertions', 'id'])
  .mapKeys((value, key) => {
    return key === 'spec' ? 'http_check' : key;
  })
  .defaults({
    name: 'Http Check'
  })
  .value();
}

function formatCheckData(check){
  //TODO switch this to be more flexible
  if (check.target.type.match('rds|dbinstance')){
    return formatCloudwatchCheck(check);
  }
  return formatHttpCheck(check);
}

export function test(data){
  const check = formatHttpCheck(data, true);
  return (dispatch, state) => {
    dispatch({
      type: CHECK_TEST,
      payload: graphPromise('testCheck.responses', () => {
        return request
        .post(`${config.services.compost}`)
        .set('Authorization', state().user.get('auth'))
        .send({
          query: `mutation Test ($check: Check){
            testCheck(check: $check) {
              responses {
                error
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
                }
              }
            }
          }`,
          variables: {
            check
          }
        });
      })
    });
  };
}

export const testCheckReset = createAction(CHECK_TEST_RESET);

export const selectResponse = createAction(CHECK_TEST_SELECT_RESPONSE);

function saveNotifications(state, data, checkId, isEditing){
  //ensure no duplicate notifications
  const notifications = _.uniqBy(data.notifications, n => {
    // pagerduty values are both bogus and unique, so just filter by type for that
    return n.type === 'pagerduty' ? n.type : n.type + n.value;
  });
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
      saveNotifications(state, data, _.get(checkRes, 'body.checks[0].id') || data.id, isEditing)
      .then(() => {
        resolve(checkRes);
      }).catch(reject);
    }).catch(reject);
  });
}

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
        .send({
          query: `mutation Mutation ($checks: [Check]){
            checks(checks: $checks) {
              id
            }
          }`,
          variables: {
            checks
          }
        });
      }, null, (payload) => {
        analytics.trackEvent('Check', 'create')(dispatch, state);
        const id = _.chain(payload).get('data').thru(arr => arr || []).head().get('id').value();
        const redirect = id ? `/check/${id}` : '/';
        setTimeout(() => {
          dispatch(pushState(null, redirect));
        }, 100);
      })
    });
  };
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

export function multiEditNotifications(data){
  return (dispatch, state) => {
    dispatch({
      type: CHECK_MULTIEDIT_NOTIFICATIONS,
      payload: new Promise((resolve, reject) => {
        return request
        .post(`https://hugs.in.opsee.com/notifications-multicheck`)
        .set('Authorization', state().user.get('auth'))
        .send(data)
        .then(res => {
          resolve({
            data:  _.get(res.body, 'checks'),
            search: state().search
          });
        })
      })
    });
  };
}

export function selectToggle(id){
  return (dispatch, state) => {
    dispatch({
      type: CHECK_SELECT_TOGGLE,
      payload: id
    });
    getCheck(id)(dispatch, state);
  };
}