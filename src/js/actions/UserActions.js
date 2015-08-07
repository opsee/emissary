import Constants from '../Constants';
import Flux from '../Flux';
import request from '../request';

// request.get('https://api.github.com/users/mralexgray/repos').then(function(res){
//   console.log(res);
// })

const actions = Flux.createActions({
  userLogin:function(data){
    request
      .post(`${Constants.api}/authenticate/password`)
      .send(data).then(res => {
        Flux.actions.userLoginSuccess(res.body);
      }).catch(err => {
        Flux.actions.userLoginError(err.response && err.response.text);
      });
    return {
      actionType: 'USER_LOGIN_PENDING',
      data:data
    }
  },
  userLoginSuccess(data){
    return {
      actionType: 'USER_LOGIN_SUCCESS',
      data:data
    }
  },
  userLoginError(err){
    return {
      actionType: 'USER_LOGIN_ERROR',
      data:err
    }
  }
});

export default actions;