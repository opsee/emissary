import React from 'react';
import Perf from 'react-addons-perf';
// import router from './modules/router.js';
import _ from 'lodash';
import {hideNavList} from './components/global/Routes.jsx';
import {GlobalActions} from './actions';
import config from './modules/config';
import {render} from 'react-dom';
import {routes} from './components/global/Routes.jsx';
import ReactRouter, {Router, Route} from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
const history = createBrowserHistory();

if (config.env !== 'production'){
  window._ = _;
  window.Perf = Perf;
  window.Perf.start();
}

render(
  <Router history={history}>{routes}</Router>, document.getElementById('main')
);

// router.run((Root, state) => {
//   const testRoutes = state.routes;
//   const names = _.pluck(testRoutes, 'name');
//   const shouldHideNav = !(_.intersection(names, hideNavList).length);
//   GlobalActions.globalSetNav(shouldHideNav);
//   render(
//       (
//         <div>
//           <Root params={state.params} {...state}>
//           {
//             // <CSSTransitionGroup transitionName="example">
//             //   {React.cloneElement(this.props.children || <div/>, {key: 'foo'})}
//             // </CSSTransitionGroup>
//           }
//           </Root>
//         </div>
//       ),
//       document.getElementById('main')
//   );
// });