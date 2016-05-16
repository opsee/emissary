import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import reducer from '../reducers';
import {reduxReactRouter} from 'redux-router';
import {createHistory} from 'history';
import useSimpleScroll from 'scroll-behavior/lib/useSimpleScroll';
import {promiseMiddleware} from './promiseMiddleware';

const scrollableHistory = useSimpleScroll(createHistory);

const reduxRouter = reduxReactRouter({
  createHistory: scrollableHistory
});

const middleware = [
  thunk,
  promiseMiddleware
];

let finalCreateStore;

if (process.env.NODE_ENV === 'production') {
  finalCreateStore = compose(
    applyMiddleware(...middleware),
    reduxRouter
  )(createStore);
} else {
  finalCreateStore = compose(
    applyMiddleware(...middleware),
    reduxRouter,
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )(createStore);
}

export default finalCreateStore(reducer);