import {UserStore} from '../stores';
import {UserActions} from '../actions';

export default {
  PageAuth(transition){
    if (UserStore.hasUser()){
      return true;
    }
    UserActions.userLoginRedirect(transition.path);
    return transition.redirect('login');
  }
};