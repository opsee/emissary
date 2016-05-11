const fs = require('fs');
const _ = require('lodash');
const crypto = require('crypto');

const deps = JSON.parse(fs.readFileSync('package.json')).dependencies;
const outlaws = ['flexboxgrid', 'react-bootstrap', 'highlight.js'];
const vendors = _.omit(deps, outlaws);
const hash = crypto.createHash('md5').update(JSON.stringify(vendors)).digest('hex');

module.exports = {
  vendors,
  hash
}