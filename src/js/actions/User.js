import constants from '../constants';
import Flux from '../Flux';
import request from '../request';
import _ from 'lodash';

// request.get('https://api.github.com/users/mralexgray/repos').then(function(res){
//   console.log(res);
// })

var userLogin = Flux.statics.addAsyncAction('userLogin',
  (data) => {
    return request
    .post(`${constants.api}/authenticate/password`)
    .send(data)
  },
  res => res.body && res.body,
  res => res && res.response
);

var userSendResetEmail = Flux.statics.addAsyncAction('userSendResetEmail',
  (data) => {
    return request
    .post(`${constants.api}/authenticate/reset`)
    .send(data)
  },
  res => res.body && res.body,
  res => res && res.response
);

const userLogOut = Flux.createActions({
  userLogOut(){
    return {
      actionType: 'USER_LOG_OUT'
    }
  }
});

export default _.assign({}, userLogin, userSendResetEmail, userLogOut);