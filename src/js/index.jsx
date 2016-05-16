import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import App from './components/global/App';
import store from './modules/store';

render((
  <div>
    <Provider store={store}>
      <App/>
    </Provider>
  </div>
), document.getElementById('main'));