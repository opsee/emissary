import React from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {push, ReduxRouter} from 'redux-router';

import config from '../../modules/config';
import routes from './Routes.jsx';

if (process.env.NODE_ENV !== 'production'){
  window._ = _;
  if (config.remoteDebugPort){
    /*eslint-disable*/
    (function(e){e.setAttribute("src",`http://${window.location.hostname}:${config.remoteDebugPort}/target/target-script-min.js#anonymous`);document.getElementsByTagName("body")[0].appendChild(e);})(document.createElement("script"));void(0);
    /*eslint-enable*/
  }
  if (process.env.NODE_ENV === 'debug'){
    window.Perf = require('react-addons-perf');
    window.Perf.start();
  }
}

const App = React.createClass({
  render(){
    return (
      <ReduxRouter>{routes}</ReduxRouter>
    );
  }
});

export default connect(null, {push})(App);