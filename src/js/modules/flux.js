import McFly from 'mcfly';
import config from './config';
import _ from 'lodash';

const Flux = new McFly();
Flux.statics = {
  addAction(baseName, fn){
    const upperName = _.startCase(baseName).split(' ').join('_').toUpperCase();
    let obj = {};
    obj[baseName] = function(...args){
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
    obj[`${baseName}Success`] = function(res, arg0){
      return {
        actionType:`${upperName}_SUCCESS`,
        data: successFn(res, arg0)
      };
    };
    obj[`${baseName}Error`] = function(res){
      return {
        actionType:`${upperName}_ERROR`,
        data: errorFn(res)
      };
    };
    obj[baseName] = function(...args){
      setTimeout(function(){
        requestFn.call(null, ...args)
        .then((res) => {
          Flux.actions[`${baseName}Success`].call(null, res, args[0]);
        })
        .catch(Flux.actions[`${baseName}Error`]);
      }, config.apiDelay);
      return {
        actionType:`${upperName}_PENDING`,
        data: args[0]
      };
    };
    return Flux.createActions(obj);
  },
  statusProcessor(payload, originalStatuses, Store){
    let haveChanged = false;
    let statuses = _.cloneDeep(originalStatuses);
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
        statuses[k] = 'pending';
      }else if (payload.actionType.match('_SUCCESS$')){
        statuses[k] = 'success';
      }else {
        statuses[k] = payload.data;
      }
    }

    if (!_.isEqual(statuses, originalStatuses)){
      haveChanged = true;
    }else {
      let resetSuccessStatuses = _.mapValues(statuses, val => {
        if (val === 'success'){
          return null;
        }
        return val;
      });
      if (!_.isEqual(statuses, resetSuccessStatuses)){
        statuses = resetSuccessStatuses;
        haveChanged = true;
      }
    }
    return {statuses, haveChanged};
    // setTimeout(() => {
    //   if (haveChanged && Store){
    //     Store.emitChange();
    //   }
    // },50);
    return statuses;
  },
  generateStatusFunctions(statuses){
    let statusFunctions = {};
    let keys = _.chain(statuses).keys().map(k => {
      let arr = [k];
      arr.push('get' + _.startCase(k).split(' ').join('') + 'Status');
      return arr;
    }).forEach(a => {
      statusFunctions[a[1]] = function(){
        return _statuses[a[0]];
      };
    }).value();
    return statusFunctions;
  },
  createStoreAutomated(data, statuses, statics, switchFn){
    var obj = {};
    function makeFn(o, key){
      return function(){
        console.log(o,key);
        return o[key];
      };
    }
    for (var key1 in data){
      const str = _.startCase(key1).split(' ').join('');
      obj[`get${str}`] = makeFn(data, key1);
    }
    for (var key2 in statuses){
      const str = _.startCase(key2).split(' ').join('');
      obj[`get${str}Status`] = makeFn(statuses, key2);
    }
    statics = _.extend(statics, obj);
    return Flux.createStore(statics, switchFn);
  }
};
export default Flux;
