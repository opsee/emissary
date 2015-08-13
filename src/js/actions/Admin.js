import Constants from '../Constants';
import Flux from '../Flux';
import request from '../request';
import UserStore from '../stores/User';
import response from '../response';

const actions = Flux.createActions({
  getSignups(data){
    const auth = UserStore.getAuth();
    request
      .get(`${Constants.api}/signups`)
      .set('Authorization', auth)
      .then(res => {
        Flux.actions.getSignupsSuccess(res);
      }).catch(res => {
        response(res).then(Flux.actions.getSignupsError);
      });
    return {
      actionType: 'GET_SIGNUPS_PENDING'
    }
  },
  getSignupsSuccess(res){
    return {
      actionType: 'GET_SIGNUPS_SUCCESS',
      data:res.body && res.body
    }
  },
  getSignupsError(res){
    console.log(res);
    return {
      actionType: 'GET_SIGNUPS_ERROR',
      data:res.response
    }
  },
  activateSignup(signup){
    const auth = UserStore.getAuth();
    request
      .post(`${Constants.api}/signups/send-activation?email=${signup.email}`)
      .set('Authorization', auth)
      .send({email:signup.email})
      .then(res => {
        Flux.actions.activateSignupSuccess(res);
      }).catch(res => {
        response(res).then(Flux.actions.activateSignupError);
      });
    return {
      actionType: 'ACTIVATE_SIGNUP_PENDING'
    }
  },
  activateSignupSuccess(res){
    return {
      actionType: 'ACTIVATE_SIGNUP_SUCCESS',
      data:res.body && res.body
    }
  },
  activateSignupError(res){
    return {
      actionType: 'ACTIVATE_SIGNUP_ERROR',
      data:res.response
    }
  }
});

export default actions;