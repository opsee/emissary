import React from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {pushState, ReduxRouter} from 'redux-router';

import config from '../../modules/config';
import routes from './Routes.jsx';

if (config.env !== 'production'){
  window._ = _;
  // window.Perf = require('react-addons-perf');
  // window.Perf.start();
}

const App = React.createClass({
  render(){
    return (
      <ReduxRouter>{routes}</ReduxRouter>
    );
  }
});

export default connect(null, {pushState})(App);