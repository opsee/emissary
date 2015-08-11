import UserStore from './stores/UserStore';

export default {
  PageAuth(transition, params, query){
    if(UserStore.getAuth()){
      return true;
    }else{
      return transition.redirect('login');
    }
  }
}