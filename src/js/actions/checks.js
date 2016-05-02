import {pushState} from 'redux-router';
import config from '../modules/config';
import request from '../modules/request';
import {createAction} from 'redux-actions';
import * as analytics from './analytics';
import _ from 'lodash';
import {
  GET_CHECK,
  GET_CHECK_NOTIFICATION,
  GET_CHECKS,
  CHECK_DELETE,
  CHECK_CREATE,
  CHECK_EDIT,
  CHECK_TEST,
  CHECK_TEST_RESET,
  CHECK_TEST_SELECT_RESPONSE
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

export function getCheck(id){
  return (dispatch, state) => {
    dispatch({
      type: GET_CHECK,
      payload: new Promise((resolve, reject) => {
        const r1 = request
        .get(`${config.services.api}/checks/${id}`)
        .set('Authorization', state().user.get('auth'));

        const r2 = new Promise((r2resolve) => {
          request
          .get(`${config.services.api}/notifications/${id}`)
          .set('Authorization', state().user.get('auth'))
          .then(r2resolve, () => {
            r2resolve({body: {notifications: []}});
          });
        });

        Promise.all([r1, r2]).then((values) => {
          const check = values[0].body;
          const {notifications} = values[1].body;
          const obj = _.assign({}, check, {notifications});
          resolve({
            data: obj,
            search: state().search
          });
        }, reject);
      })
    });
  };
}

export function getChecks(redirect){
  return (dispatch, state) => {
    dispatch({
      type: GET_CHECKS,
      payload: new Promise((resolve, reject) => {
        return request
        .get(`${config.services.api}/checks`)
        .set('Authorization', state().user.get('auth'))
        .then(res => {
          resolve({
            data: _.get(res.body, 'checks'),
            search: state().search
          });
          if (redirect){
            setTimeout(() => {
              dispatch(pushState(null, '/'));
            }, 30);
          }
        }, reject);
      })
    });
  };
}

export function del(id){
  return (dispatch, state) => {
    dispatch({
      type: CHECK_DELETE,
      payload: new Promise((resolve, reject) => {
        return request
        .del(`${config.services.api}/checks/${id}`)
        .set('Authorization', state().user.get('auth'))
        .then(res => {
          resolve(res.body);
          getChecks(true)(dispatch, state);
          analytics.trackEvent('Check', 'delete', id)(dispatch, state);
        }, reject);
      })
    });
  };
}

function formatCheckData(data){
  let obj = _.cloneDeep(data);
  const spec = obj.check_spec.value;
  if (obj.target.type === 'security'){
    obj.target.type = 'sg';
  }
  if (obj.target.type.match('^EC2$|^ecc$')){
    obj.target.type = 'instance';
  }
  let arr = obj.assertions || [];
  const assertions = arr.map(a => {
    return _.assign({}, a, {
      operand: typeof a.operand === 'number' ? a.operand.toString() : a.operand
    });
  });
  obj.check_spec.value.headers = _.filter(spec.headers, h => {
    return h.name && h.values && h.values.length;
  });
  obj.check_spec.value = _.pick(spec, ['headers', 'path', 'port', 'protocol', 'verb', 'body']);
  return _.assign({}, _.pick(obj, ['target', 'interval', 'check_spec', 'name']), {
    assertions
  });
}

export function test(data){
  return (dispatch, state) => {
    dispatch({
      type: CHECK_TEST,
      payload: new Promise((resolve, reject) => {
        if (process.env.NODE_ENV !== 'production'){
          if (data.check_spec.value.path.match('jsonassertion')){
            return resolve([
              {
                response: {
                  type_url: 'HttpResponse',
                  value: require('../../files/exampleResponseJson')
                }
              }
            ]);
          }
          if (data.check_spec.value.path.match('services\/200')){
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
        .pick(['check_spec', 'interval', 'name', 'target'])
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