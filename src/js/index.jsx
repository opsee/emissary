import React from 'react';
import Perf from 'react-addons-perf';
// import router from './modules/router.js';
import _ from 'lodash';
import config from './modules/config';
import {render} from 'react-dom';
import {routes} from './components/global/Routes.jsx';
import {Router} from 'react-router';
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