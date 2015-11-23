import React from 'react';
import Perf from 'react-addons-perf';
// import router from './modules/router.js';
import _ from 'lodash';
import {render} from 'react-dom';
import {Router} from 'react-router';
import {connect} from 'react-redux';

import config from '../../modules/config';
import routes from './Routes.jsx';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import {useStandardScroll} from 'scroll-behavior';
import createStore from '../../modules/store';
const store = createStore();

const history = useStandardScroll(createBrowserHistory)();

console.log(routes);

if (config.env !== 'production'){
  window._ = _;
  window.Perf = Perf;
  window.Perf.start();
}

const App = React.createClass({
  render(){
    return(
      <Router history={history} {...this.props}>{routes}</Router>
    );
  }
});

function select(state) {
  return {
    counter: state.counter
  }
}
export default connect(select)(App);