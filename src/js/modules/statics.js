import {UserStore} from '../stores';

export default {
  PageAuth(transition, params, query){
    if(UserStore.hasUser()){
      return true;
    }else{
      return transition.redirect('login');
    }
  }
}