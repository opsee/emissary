import Constants from '../Constants';
import Flux from '../Flux';
import router from '../router.jsx';

const actions = Flux.createActions({
  transition:function(page, url){
    router.transitionTo(page, {stepUrl:url});
  }
});

export default actions;