import McFly from 'mcfly';
import constants from './constants';
import assign from 'object-assign';
import _ from 'lodash';

const Flux = new McFly();
Flux.statics = {
  addAction(baseName, fn){
    const upperName = _.startCase(baseName).split(' ').join('_').toUpperCase();
    let obj = {};
    obj[baseName] = function(data){
      if(typeof fn == 'function'){
        fn.call();
      }
      return {
        actionType:upperName,
        data:data
      }
    };
    return Flux.createActions(obj);
  },
  addAsyncAction(baseName, requestFn, successFn, errorFn){
    const upperName = _.startCase(baseName).split(' ').join('_').toUpperCase();
    let obj = {};
    obj[`${baseName}Success`] = function(res){
      return {
        actionType:`${upperName}_SUCCESS`,
        data:successFn(res)
      }
    }
    obj[`${baseName}Error`] = function(res){
      return {
        actionType:`${upperName}_ERROR`,
        data:errorFn(res)
      }
    }
    obj[baseName] = function(...args){
      setTimeout(function(){
        requestFn.call(null, ...args)
        .then(Flux.actions[`${baseName}Success`])
        .catch(Flux.actions[`${baseName}Error`]);
      }, constants.apiDelay);
      return {
        actionType:`${upperName}_PENDING`,
        data:args[0]
      }
    }
    return Flux.createActions(obj);
  },
  statusProcessor(payload, originalStatuses){
    let statuses = _.cloneDeep(originalStatuses);
    let keys = Object.keys(statuses);
    let possible = _.chain(keys).map(k => {
      return _.startCase(k).split(' ').join('_').toUpperCase();
    }).map(k => {
      return [`${k}_PENDING`, `${k}_SUCCESS`, `${k}_ERROR`]
    }).value();
    let found = _.find(possible, p => {
      return _.find(p, s => s == payload.actionType);
    });
    if(found){
      const index = _.indexOf(possible, found);
      const k = keys[index];
      if(payload.actionType.match('_PENDING$')){
        statuses[k] = 'pending';
      }else if(payload.actionType.match('_SUCCESS$')){
        statuses[k] = 'success';
      }else{
        statuses[k] = payload.data;
      }
    }
    return statuses;
  }
}
export default Flux;
