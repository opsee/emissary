import Constants from '../Constants';
import Flux from '../Flux';
import request from '../request';

const actions = Flux.createActions({
  signupCreate(data){
    request
      .post(`${Constants.api}/signups`)
      .send(data).then(res => {
        Flux.actions.signupCreateSuccess(res);
      }).catch(res => {
        Flux.actions.signupCreateError(res);
      });
    return {
      actionType: 'SIGNUP_CREATE_PENDING',
      data:data
    }
  },
  signupCreateSuccess(res){
    return {
      actionType: 'SIGNUP_CREATE_SUCCESS',
      data:res.body
    }
  },
  signupCreateError(res){
    return {
      actionType: 'SIGNUP_CREATE_ERROR',
      data:res.response
    }
  },
  userLogOut(){
    return {
      actionType: 'USER_LOG_OUT'
    }
  }
});

export default actions;