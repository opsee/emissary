import McFly from 'mcfly';
import Constants from './Constants';
import assign from 'object-assign';
import _ from 'lodash';

const Flux = new McFly();
Flux.statics = {
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
      requestFn.call(null, ...args)
      .then(Flux.actions[`${baseName}Success`])
      .catch(Flux.actions[`${baseName}Error`]);
      return {
        actionType:`${upperName}_PENDING`
      }
    }
    return Flux.createActions(obj);
  }
}
export default Flux;
