import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import App from './components/global/App';
import store from './modules/store';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

render(
  (
    <div>
      <Provider store={store}>
        <App/>
      </Provider>
      <DebugPanel top right bottom>
        <DevTools store={store} monitor={LogMonitor} />
      </DebugPanel>
    </div>
  ), document.getElementById('main'));