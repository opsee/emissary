import {UserStore} from '../stores';
import {UserActions} from '../actions';

export default {
  PageAuth(transition, params, query){
    if(UserStore.hasUser()){
      return true;
    }else{
      UserActions.userLoginRedirect(transition.path);
      return transition.redirect('login');
    }
  }
}