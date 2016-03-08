import _ from 'lodash';

function getKeys(obj){
  if (_.isObject(obj)){
    if (Array.isArray(obj)){
      return _.range(obj.length).map(num => `[${num}]`);
    }
    return _.keys(obj).map(key => `.${key}`);
  }
  return [];
}

function traverse(obj, stack, parent = ''){
  const keys = getKeys(obj);
  if (parent && !keys.length){
    stack.push(parent);
  }
  keys.forEach(k => {
    traverse(_.get(obj, k), stack, parent + k);
  });
}

export default function produceKeyArray(obj = {}) {
  let stack = [];
  traverse(obj, stack);
  return stack.map(item => {
    return item.charAt(0) === '.' ? item.slice(1) : item;
  });
}