import _ from 'lodash';

export default function(selector, fn, meta, callback = () => {}){
  return new Promise((resolve, reject) => {
    return fn().then(res => {
      const errors = _.get(res, 'body.errors');
      if (Array.isArray(errors) && errors.length){
        return reject(errors[0]);
      }
      const payload = _.defaults({
        data: _.get(res, `body.data.${selector}`)
      }, meta);
      resolve(payload);
      return callback(payload);
    }, reject);
  });
}