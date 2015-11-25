import storage from '../modules/storage';
import analytics from '../modules/analytics';
import Immutable, {Record} from 'immutable';
import _ from 'lodash';
import {handleAction, handleActions} from 'redux-actions';

const User = Record({
  name: null,
  email: null,
  id: null,
  token: null,
  loginDate: null,
  admin: false,
  admin_id: 0,
  intercom_hmac: null
});

const initial = {
  user: storage.get('user') ? new User(storage.get('user')) : new User(),
  authenticating: false,
  error: undefined
}

export default handleActions({
  USER_LOGIN_REQ(state){
    // return {
    //   ...state,
    //   userLoginPending: 'pending'
    // };
  },
  USER_LOGIN:{
    next(state, action){
      let obj = _.assign({},
        action.payload.user,
        {
          token: action.payload.token,
          loginDate: new Date()
        }
      );
      storage.set('user', obj);
      return _.assign({}, state, {
        user: new User(obj),
        loginReq: 'success'
      })
    },
    throw(state, action){
      return _.assign({}, state, {
        loginReq: new Error(
          _.get(action.payload, 'response.body.message') || 'Something went wrong.'
        )
      });
      debugger;
    }
  }
}, initial);

//   switch (payload.type) {
//     case 'USER_LOGOUT':
//     case 'USER_REFRESH_TOKEN_ERROR':
//       analytics.event('User', 'logout', payload.type);
//       window.Intercom('shutdown');
//       storage.remove('user');
//       _data.user = new User();
//       clearInterval(window.userRefreshTokenInterval);
//       delete window.userRefreshTokenInterval;
//       if (window.socket){window.socket.close();}
//       return _.assign({}, state, {
//         user: new User()
//       });
//       break;
//     default:
//       return state;
//   }
// };