import {pushState} from 'redux-router';
import config from '../modules/config';
import request from '../modules/request';
import _ from 'lodash';
import createAction from '../modules/createAction';

export const userLoginReq = createAction('USER_LOGIN_REQ');
export const login = createAction('USER_LOGIN', (data) => {
  return request
  .post(`${config.authApi}/authenticate/password`)
  .send(data);
  // const result = await request
  // .post(`${config.authApi}/authenticate/password`)
  // .send(data);
  // return result.body;
  // return (dispatch) => {
  //   dispatch(userLoginReq());
  //   request
  //   .post(`${config.authApi}/authenticate/password`)
  //   .send(data)
  //   .then(res => {
  //     // const string = redirect || '/';
  //     dispatch(userLogin(res.body));
  //     dispatch(pushState(null, '/'));
  //   })
  //   .catch(err => {
  //     dispatch(userLogin(err));
  //   })
  // }
});
export const userLogout = createAction('USER_LOGOUT');
export const userLoginDismissError = createAction('USER_LOGIN_DISMISS_ERROR');

export function logout() {
    return {
        type: 'USER_LOGOUT'
    }
}

export function logoutAndRedirect() {
    return (dispatch, state) => {
        dispatch(logout());
        dispatch(pushState(null, '/login'));
    }
}

// export function login(data) {
//   return (dispatch) => {
//     dispatch(userLoginReq());
//     request
//     .post(`${config.authApi}/authenticate/password`)
//     .send(data)
//     .then(res => {
//       // const string = redirect || '/';
//       dispatch(userLogin(res.body));
//       dispatch(pushState(null, '/'));
//     })
//     .catch(err => {
//       dispatch(userLogin(err));
//     })
//   }
// }

export function receiveProtectedData(data) {
    return {
        type: 'RECEIVE_PROTECTED_DATA',
        payload: {
            data: data
        }
    }
}

export function fetchProtectedDataRequest() {
  return {
    type: 'FETCH_PROTECTED_DATA_REQUEST'
  }
}

export function fetchProtectedData(token) {

    return (dispatch, state) => {
        dispatch(fetchProtectedDataRequest());
        return fetch('http://localhost:3000/getData/', {
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {
                dispatch(receiveProtectedData(response.data));
            })
            .catch(error => {
                if(error.response.status === 401) {
                  dispatch(userLoginFailure(error));
                  dispatch(pushState(null, '/login'));
                }
            })
       }
}

// let _actions = {};

// _actions.userLogin = Flux.statics.addAsyncAction('userLogin',
//   (data) => {
//     return request
//     .post(`${config.authApi}/authenticate/password`)
//     .send(data);
//   },
//   res => res && res.body,
//   res => res && res.response && res.response.body
// );

// _actions.userRefreshToken = Flux.statics.addAsyncAction('userRefreshToken',
//   () => {
//     return request
//     .put(`${config.authApi}/authenticate/refresh`)
//     .set('Authorization', UserStore.getAuth())
//     .timeout(7000);
//   },
//   res => res && res.body,
//   res => _.get(res, 'response.body') || res
// );

// _actions.userGetUser = Flux.statics.addAsyncAction('userGetUser',
//   (data) => {
//     return request
//     .get(`${config.authApi}/users/${data.id}`)
//     .set('Authorization', UserStore.getAuth())
//     .send(data);
//   },
//   res => res && res.body,
//   res => res && res.response
// );

// _actions.userEdit = Flux.statics.addAsyncAction('userEdit',
//   (data) => {
//     return request
//     .put(`${config.authApi}/users/${data.id}`)
//     .set('Authorization', UserStore.getAuth())
//     .send(data);
//   },
//   res => res && res.body,
//   res => res && res.response
// );

// _actions.userPutUserData = Flux.statics.addAsyncAction('userPutUserData',
//   (key, data, reset) => {
//     let user = UserStore.getUserData() || {};
//     let history = user[key];
//     let index;
//     if (history && Array.isArray(history) && history.length){
//       index = history.length - 1;
//     }else {
//       index = 0;
//       user[key] = [];
//     }
//     let record = user[key][index];
//     if (record && record.revision !== config.revision){
//       index++;
//     }
//     user[key][index] = {
//       revision: config.revision,
//       data: data
//     };
//     if (reset){
//       user[key] = false;
//     }
//     return request
//     .put(`${config.authApi}/users/${UserStore.getUser().get('id')}/data`)
//     .set('Authorization', UserStore.getAuth())
//     .send(user);
//   },
//   res => res && res.body,
//   res => res && res.response
// );

// _actions.userGetUserData = Flux.statics.addAsyncAction('userGetUserData',
//   () => {
//     return request
//     .get(`${config.authApi}/users/${UserStore.getUser().get('id')}/data`)
//     .set('Authorization', UserStore.getAuth());
//   },
//   res => res && res.body,
//   res => res && res.response
// );

// _actions.userSendResetEmail = Flux.statics.addAsyncAction('userSendResetEmail',
//   (data) => {
//     return request
//     .post(`${config.authApi}/authenticate/token`)
//     .send(data);
//   },
//   res => res.body && res.body,
//   res => res && res.response
// );

// _actions.userLogOut = Flux.statics.addAction('userLogOut');

// _actions.userSet = Flux.statics.addAction('userSet');

// export default _.assign({}, ..._.values(_actions));