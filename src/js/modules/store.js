import {createStore, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'
import reducer from '../reducers'
import promiseMiddleware from 'redux-promise';
import {reduxReactRouter} from 'redux-router';
import routes from '../components/global/Routes';
import {createHistory} from 'history';

const reduxRouter = reduxReactRouter({
  routes,
  createHistory
});

const middleware = [
  thunk,
  promiseMiddleware
];

let finalCreateStore;

if (process.env.NODE_ENV === 'production') {
  finalCreateStore = compose(
    applyMiddleware(...middleware)(createStore),
    reduxRouter
  )
} else {
  finalCreateStore = compose(
    applyMiddleware(...middleware),
    reduxRouter,
    require('redux-devtools').devTools(),
    require('redux-devtools').persistState(
      window.location.href.match(/[?&]debug_session=([^&]+)\b/)
    )
  )(createStore)
}

export default finalCreateStore(reducer);