import _ from 'lodash';

/**
This little guy just keeps things dry by simplifying error handling and returning complicated data structures back from compost
* @params {string} selector - object notation selector for the data you want returned back
          {function} fn - the promised-based function that will handle all of your api work
          {object} meta - extra metadata to be returned after work is done (usually for reducers)
          {function} callback - want to do work after the fact (like a redirect)? Use a cb dummy
*/

export default function(selector = '', fn = () => Promise.resolve(), meta = {}, callback = () => {}){
  return new Promise((resolve, reject) => {
    return fn().then(res => {
      const errors = _.get(res, 'body.errors');
      if (Array.isArray(errors) && errors.length){
        return reject(errors[0]);
      }
      const payload = _.defaults({
        data: _.get(res, `body.data.${selector}`) || res
      }, meta);
      resolve(payload);
      return callback(payload);
    }, reject);
  });
}