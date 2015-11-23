import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import App from './components/global/App';
import createStore from './modules/store';
const store = createStore();

render(
  (
    <Provider store={store}>
      <App/>
    </Provider>
  ), document.getElementById('main'));