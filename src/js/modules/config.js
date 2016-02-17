import _ from 'lodash';

const initial = require(`../../../config/default.json`);

if (process.env){
  const env = process.env.NODE_ENV || 'default';
  const optional = require(`../../../config/${env}.json`);
  window.config = _.assign(initial, optional || {});
}

export default window.config || initial || {};