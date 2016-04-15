import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import App from './components/global/App';
import store from './modules/store';

if (process.env.NODE_ENV === 'redux'){
  const DevTools = require('./components/global/DevTools').default;
  render(
  (
    <div>
      <Provider store={store}>
        <App/>
      </Provider>
      <DevTools store={store}/>
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