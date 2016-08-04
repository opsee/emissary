import {push} from 'redux-router';
import config from '../modules/config';
import request from '../modules/request';
import {createAction} from 'redux-actions';
import * as analytics from './analytics';
import _ from 'lodash';
import graphPromise from '../modules/graphPromise';
import moment from 'moment';
import {
  GET_CHECK,
  GET_CHECK_FROM_S3,
  GET_CHECKS,
  GET_CHECKS_NOTIFICATIONS,
  CHECKS_DELETE,
  CHECKS_DELETE_PENDING,
  CHECK_CREATE,
  CHECK_EDIT,
  CHECK_TEST,
  CHECK_TEST_RESET,
  CHECK_TEST_SELECT_RESPONSE,
  CHECK_SELECT_TOGGLE,
  CHECK_MULTIEDIT,
  CHECK_CREATE_OR_EDIT
} from './constants';

export function fetchChecks(state, kwargs = {}) {
  const hours = kwargs.hours || state().checks.startHours || config.checkActivityStartHours;
  const start = moment().subtract({hours}).valueOf();
  const end = Date.now().valueOf();
  return request
    .post(`${config.services.compost}`)
    .query({type: 'FETCH_CHECKS'})
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
          response_count
          state
          state_transitions(start_time: ${start}, end_time: ${end}){
            from
            to
            occurred_at
            id
          }
          results {
            bastion_id
            passing
            timestamp
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
}

/**
 * Fetches check data as JSON from the given JSON URI (e.g., an S3 URL).
 * Used by Screenshot.jsx to populate the UI for the screenshot service.
 */
export function getCheckFromURI(jsonURI) {
  return dispatch => {
    dispatch({
      type: GET_CHECK_FROM_S3,
      payload: request.get(jsonURI)
        .then(res => {
          return { data: res.body };
        })
    });
  };
}

export function getCheck(id, transitionId, kwargs = {}){
  return (dispatch, state) => {
    const hours = kwargs.hours || state().checks.startHours || config.checkActivityStartHours;
    const start = moment().subtract({hours}).valueOf();
    const start2 = moment().subtract({hours: 2}).valueOf();
    const end = Date.now().valueOf();
    const idArg = transitionId ? `id: "${id}", state_transition_id: ${transitionId}` : `id: "${id}"`;
    dispatch({
      type: GET_CHECK,
      payload: graphPromise('checks', () => {
        return request
        .post(`${config.services.compost}`)
        .query({type: GET_CHECK})
        .set('Authorization', state().user.get('auth'))
        .send({
          query: `{
            checks (${idArg}){
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
              min_failing_time
              min_failing_count
              response_count
              state
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
                bastion_id
                timestamp
                responses {
                  error
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
                    address
                    name
                  }
                }
              }
              assertions {
                value
                relationship
                operand
                key
              }
              metrics (metric_name: "request_latency", start_time: ${start2}, end_time: ${end}, aggregation: {unit: "minutes", period: 20, type:max}){
                value
                timestamp
                tags {
                  name
                  value
                }
              }
              state_transitions(start_time: ${start}, end_time: ${end}){
                from
                to
                occurred_at
                id
              }
            }
          }`
        });
      }, {
        id,
        search: state().search,
        hours: kwargs.hours || state().checks.startHours || config.checkActivityStartHours
      })
    });
  };
}

export function getChecks(kwargs = {}){
  return (dispatch, state) => {
    dispatch({
      type: GET_CHECKS,
      payload: graphPromise('checks', () => {
        return fetchChecks(state, kwargs);
      }, {search: state().search, hours: kwargs.hours || state().checks.startHours || config.checkActivityStartHours})
    });
  };
}

export function getChecksNotifications(){
  return (dispatch, state) => {
    dispatch({
      type: GET_CHECKS_NOTIFICATIONS,
      payload: graphPromise('checks', () => {
        return request
        .post(`${config.services.compost}`)
        .query({type: GET_CHECKS_NOTIFICATIONS})
        .set('Authorization', state().user.get('auth'))
        .send({
          query: `{
            checks {
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
                bastion_id
                timestamp
                responses {
                  passing
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
      }, {search: state().search})
    });
  };
}

export function del(ids, redirect){
  return (dispatch, state) => {
    dispatch({
      type: CHECKS_DELETE,
      payload: graphPromise('checks', () => {
        return new Promise((resolve, reject) => {
          request
          .post(`${config.services.compost}`)
          .query({type: CHECKS_DELETE})
          .set('Authorization', state().user.get('auth'))
          .send({query:
            `mutation Mutation {
              deleteChecks(ids: ${JSON.stringify(ids)})
            }`
          })
          .then(() => {
            // Don't resolve until we have a fresh set of checks; otherwise, it's
            // a pain to manage selected/deleting state
            fetchChecks(state).then(res => {
              resolve(res);
              if (redirect){
                setTimeout(() => {
                  dispatch(push('/'));
                }, 100);
              }
            }).catch(reject);
          }).catch(reject);
        });
      }, null, () => {
        analytics.trackEvent('Check', 'delete')(dispatch, state);
      })
    });
  };
}

export function delSelected(){
  return (dispatch, state) => {
    const ids = _.chain(state().checks.checks.toJS())
    .filter(check => check.selected)
    .map('id')
    .value();
    dispatch({
      type: CHECKS_DELETE_PENDING,
      payload: { ids }
    });
    del(ids)(dispatch, state);
  };
}

function getNamespace(type){
  switch (type){
  case 'instance':
  case 'ecc':
    return 'AWS/EC2';
  default:
    return 'AWS/RDS';
  }
}

function formatCloudwatchCheck(data){
  const check = _.pick(data, ['target', 'assertions', 'notifications', 'name', 'cloudwatch_check', 'id', 'min_failing_count', 'min_failing_time']);
  const namespace = getNamespace(check.target.type);
  const metrics = check.assertions.map(assertion => {
    return {
      name: assertion.value,
      namespace
    };
  });
  check.cloudwatch_check = {metrics};
  const {type} = check.target;
  check.target.type = type === 'rds' ? 'dbinstance' : type;
  check.target.type = type === 'ecc' ? 'instance' : type;
  check.target.type = type === 'ecs' ? 'ecs_service' : type;
  check.target = _.pick(check.target, ['id', 'name', 'type']);
  return check;
}

function formatHttpCheck(data, forTestCheck){
  let check = _.cloneDeep(data);
  const {spec, target} = check;
  if (target.type === 'security'){
    check.target.type = 'sg';
  }
  if (target.type.match('^EC2$|^ecc$')){
    check.target.type = 'instance';
  }
  if (target.type.match('ecs')){
    check.target.id = `${target.cluster}/${target.service}/${target.container}/${target.containerPort}`;
    check.target.type = 'ecs_service';
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
  .pick(['target', 'spec', 'name', 'notifications', 'assertions', 'id', 'min_failing_count', 'min_failing_time'])
  .mapValues((value, key) => {
    if (key === 'notifications'){
      return _.reject(value, n => (!n.value || !n.type));
    }
    return value;
  })
  .omit(forTestCheck && ['min_failing_time', 'min_failing_count'] || [])
  .mapKeys((value, key) => {
    return key === 'spec' ? 'http_check' : key;
  })
  .mapValues((value, key) => {
    // toss away assertions because test-check doesn't need them and it will cause issues
    // if assertions aren't fully formed
    if (forTestCheck && key === 'assertions'){
      return [];
    }
    return value;
  })
  .pickBy(v => v)
  .defaults({
    name: 'Http Check'
  })
  .value();
}

function formatCheckData(check){
  //TODO switch this to be more flexible
  if (check.type === 'cloudwatch' || _.chain(check).get('assertions').head().get('key').value() === 'cloudwatch'){
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
        .query({type: CHECK_TEST})
        .set('Authorization', state().user.get('auth'))
        .send({
          query: `mutation Test ($check: Check){
            testCheck(check: $check) {
              responses {
                error
                target {
                  id
                  address
                  name
                  type
                }
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
        .query({type: CHECK_CREATE_OR_EDIT})
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
        const id = _.chain(payload).get('data').head().get('id').value();
        const redirect = id ? `/check/${id}` : '/';
        setTimeout(() => {
          dispatch(push(redirect));
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
            dispatch(push('/'));
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
            dispatch(push('/'));
          }, 100);
        }, reject);
      })
    });
  };
}

export function multiEditNotifications(raw){
  let data = Array.isArray(raw) ? raw : [raw];
  const checks = data.map(formatCheckData);
  return (dispatch, state) => {
    dispatch({
      type: CHECK_MULTIEDIT,
      payload: graphPromise('checks', () => {
        return request
        .post(`${config.services.compost}`)
        .query({type: CHECK_MULTIEDIT})
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
      }, null, () => {
        analytics.trackEvent('Check', 'multiedit notifications')(dispatch, state);
        setTimeout(() => {
          dispatch(push('/'));
        }, 100);
      })
    });
  };
}

export function selectToggle(id){
  return (dispatch) => {
    dispatch({
      type: CHECK_SELECT_TOGGLE,
      payload: id
    });
  };
}