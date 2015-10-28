import {routes} from '../components/global/Routes.jsx';
import Router from 'react-router';

const router = Router.create({
  routes: routes,
  location: Router.HistoryLocation
});

export default {
  makePath: router.makePath,
  makeHref: router.makeHref,
  transitionTo: router.transitionTo,
  replaceWith: router.replaceWith,
  goBack: router.goBack,
  run: router.run,
  getAllRoutes(){
    return router.routes[0].childRoutes.map(r => {
      return {
        name: r.name,
        path: r.path
      };
    });
  }
};