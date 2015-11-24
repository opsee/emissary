import React from 'react';
import Perf from 'react-addons-perf';
// import router from './modules/router.js';
import _ from 'lodash';
import {render} from 'react-dom';
import {Router} from 'react-router';
import {connect} from 'react-redux';
import {pushState, ReduxRouter} from 'redux-router';

import config from '../../modules/config';
import routes from './Routes.jsx';
// import createBrowserHistory from 'history/lib/createBrowserHistory';
// import {useStandardScroll} from 'scroll-behavior';

if (config.env !== 'production'){
  window._ = _;
  window.Perf = Perf;
  window.Perf.start();
}

const App = React.createClass({
  render(){
    return(
      <ReduxRouter>{routes}</ReduxRouter>
    );
  }
});

function select(state) {
  return {
    counter: state.counter,
    q: _.get(state.router, 'location.query.q')
  }
}
export default connect(select, {pushState})(App);