import McFly from 'mcfly';
import config from './config';
import _ from 'lodash';

const Flux = new McFly();
Flux.statics = {
  addAction(baseName, fn){
    const upperName = _.startCase(baseName).split(' ').join('_').toUpperCase();
    let obj = {};
    obj[baseName] = (...args) => {
      if (typeof fn === 'function'){
        fn.call(null, ...args);
      }
      return {
        actionType: upperName,
        data: args[0]
      };
    };
    return Flux.createActions(obj);
  },
  addAsyncAction(baseName, requestFn, successFn, errorFn){
    const upperName = _.startCase(baseName).split(' ').join('_').toUpperCase();
    let obj = {};
    obj[`${baseName}Success`] = (res, arg0) => {
      return {
        actionType: `${upperName}_SUCCESS`,
        data: successFn(res, arg0)
      };
    };
    obj[`${baseName}Error`] = (res, arg0) => {
      return {
        actionType: `${upperName}_ERROR`,
        data: errorFn(res, arg0)
      };
    };
    obj[baseName] = (...args) => {
      setTimeout(() => {
        requestFn.call(null, ...args)
        .then(
          Flux.actions[`${baseName}Success`],
          Flux.actions[`${baseName}Error`]
        );
      }, config.apiDelay);
      return {
        actionType: `${upperName}_PENDING`,
        data: args[0]
      };
    };
    return Flux.createActions(obj);
  },
  statusProcessor(payload, identityObject, Store){
    let haveChanged = false;
    if (!identityObject._statuses){
      return console.error('Improper status processor setup', Store);
    }
    let statuses = _.cloneDeep(identityObject._statuses);
    let keys = Object.keys(statuses);
    let possible = _.chain(keys).map(k => {
      return _.startCase(k).split(' ').join('_').toUpperCase();
    }).map(k => {
      return [`${k}_PENDING`, `${k}_SUCCESS`, `${k}_ERROR`];
    }).value();
    let found = _.find(possible, p => {
      return _.find(p, s => s === payload.actionType);
    });
    if (found){
      const index = _.indexOf(possible, found);
      const k = keys[index];
      if (payload.actionType.match('_PENDING$')){
        statuses[k] = _.assign({}, statuses[k], {state: 'pending'});
      }else if (payload.actionType.match('_SUCCESS$')){
        statuses[k] = _.assign({}, statuses[k]);
        if (statuses[k].state !== 'success'){
          let history = statuses[k].history || [];
          history.push(Date.now());
          statuses[k].history = history;
        }
        statuses[k].state = 'success';
      }else {
        statuses[k] = _.assign({}, statuses[k], {state: payload.data});
      }
    }

    if (!_.isEqual(statuses, identityObject._statuses)){
      haveChanged = true;
    }else {
      let resetSuccessStatuses = _.mapValues(statuses, val => {
        if (_.get(val, 'state') === 'success'){
          return {state: null, history: val.history};
        }
        return val;
      });
      if (!_.isEqual(statuses, resetSuccessStatuses)){
        statuses = resetSuccessStatuses;
        haveChanged = true;
      }
    }
    return {statuses, haveChanged};
  },
  generateStatusFunctions(obj){
    if (!obj._statuses){
      return console.error('Improper status processor setup', obj);
    }
    const statuses = obj._statuses;
    let statusFunctions = {};
    _.chain(statuses).keys().map(k => {
      let arr = [k];
      arr.push('get' + _.startCase(k).split(' ').join('') + 'Status');
      arr.push('get' + _.startCase(k).split(' ').join('') + 'History');
      return arr;
    }).forEach(a => {
      statusFunctions[a[1]] = () => {
        return _.get(obj._statuses[a[0]], 'state');
      };
      statusFunctions[a[2]] = () => {
        return _.get(obj._statuses[a[0]], 'history') || [];
      };
    }).value();
    return statusFunctions;
  },
  createStoreAutomated(data, statuses, statics, switchFn){
    let obj = {};
    function makeFn(o, key){
      return () => {
        return o[key];
      };
    }
    for (const key1 in data){
      const str = _.startCase(key1).split(' ').join('');
      obj[`get${str}`] = makeFn(data, key1);
    }
    for (const key2 in statuses){
      const str = _.startCase(key2).split(' ').join('');
      obj[`get${str}Status`] = makeFn(statuses, key2);
    }
    const newStatics = _.extend(statics, obj);
    return Flux.createStore(newStatics, switchFn);
  }
};
export default Flux;
