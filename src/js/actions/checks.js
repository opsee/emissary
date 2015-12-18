import {pushState} from 'redux-router';
import config from '../modules/config';
import request from '../modules/request';
import {createAction} from 'redux-actions';
import _ from 'lodash';
import {
  GET_CHECK,
  GET_CHECKS,
  CHECK_DELETE,
  CHECK_CREATE,
  CHECK_EDIT,
  CHECK_TEST,
  CHECK_TEST_RESET,
  CHECK_TEST_SELECT_RESPONSE
} from './constants';

export function getCheck(id){
  return (dispatch, state) => {
    dispatch({
      type: GET_CHECK,
      payload: new Promise((resolve, reject) => {
        const r1 = request
        .get(`${config.api}/checks/${id}`)
        .set('Authorization', state().user.get('auth'));

        const r2 = new Promise((r2resolve) => {
          request
          .get(`${config.api}/notifications/${id}`)
          .set('Authorization', state().user.get('auth'))
          .then(r2resolve, () => {
            r2resolve({body: {notifications: []}});
          });
        });

        const r3 = request
        .get(`${config.api}/assertions/${id}`)
        .set('Authorization', state().user.get('auth'));

        Promise.all([r1, r2, r3]).then((values) => {
          const check = values[0].body;
          const {notifications} = values[1].body;
          const {assertions} = values[2].body;
          const obj = _.assign({}, check, {notifications, assertions});
          resolve(obj);
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
        .get(`${config.api}/checks`)
        .set('Authorization', state().user.get('auth'))
        .then(res => {
          resolve(_.get(res.body, 'checks'));
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
        .del(`${config.api}/checks/${id}`)
        .set('Authorization', state().user.get('auth'))
        .then(res => {
          resolve(res.body);
          getChecks(true)(dispatch, state);
        }, reject);
      })
    });
  };
}

function formatCheckData(data){
  let obj = _.cloneDeep(data);
  if (obj.target.type === 'security'){
    obj.target.type = 'sg';
  }
  if (obj.target.type === 'EC2'){
    obj.target.type = 'instance';
  }
  return _.pick(obj, ['target', 'interval', 'check_spec', 'name']);
}

export function test(data){
  return (dispatch, state) => {
    dispatch({
      type: CHECK_TEST,
      payload: new Promise((resolve, reject) => {
        let newData = formatCheckData(data);
        newData = _.assign(newData, {name: state().user.get('email')});
        return request
        .post(`${config.api}/bastions/test-check`)
        .set('Authorization', state().user.get('auth'))
        .send({check: newData, max_hosts: 3, deadline: '30s'})
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
  return request
  [isEditing ? 'put' : 'post'](`${config.api}/notifications${isEditing ? '/' + checkId : ''}`)
  .set('Authorization', state().user.get('auth'))
  .send({
    'check-id': checkId,
    notifications: data.notifications
  });
}

function saveAssertions(state, data, checkId, isEditing){
  return request
  [isEditing ? 'put' : 'post'](`${config.api}/assertions${isEditing ? '/' + checkId : ''}`)
  .set('Authorization', state().user.get('auth'))
  .send({
    'check-id': checkId,
    assertions: data.assertions
  });
}

function checkCreateOrEdit(state, data, isEditing){
  return new Promise((resolve, reject) => {
    const d = formatCheckData(data);
    request
    [isEditing ? 'put' : 'post'](`${config.api}/checks${isEditing ? '/' + data.id : ''}`)
    .set('Authorization', state().user.get('auth'))
    .send(d).then(checkRes =>{
      saveNotifications(state, data, _.get(checkRes, 'body.id') || data.id, isEditing)
      .then(() => {
        saveAssertions(state, data, _.get(checkRes, 'body.id') || data.id, isEditing).then(() => {
          resolve(checkRes);
        }).catch(reject);
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
          setTimeout(() => {
            dispatch(pushState(null, '/'));
          }, 100);
        }, reject);
      })
    });
  };
}