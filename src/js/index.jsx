import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import App from './components/global/App';
import store from './modules/store';

if (process.env.NODE_ENV === 'debug'){
  const DevTools = require('./components/global/DevTools');
  render(
  (
    <div>
      <Provider store={store}>
        <App/>
      </Provider>
      <DevTools/>
    </div>
  ), document.getElementById('main'));
} else {
  render(
  (
    <div>
      <Provider store={store}>
        <App/>
      </Provider>
    </div>
  ), document.getElementById('main'));
}