import _ from 'lodash';

function getVerbAndSuffix(numberIncomplete){
  const suffix = numberIncomplete > 1 ? 's' : '';
  const verb = suffix === 's' ? 'are' : 'is';
  return {
    suffix,
    verb
  };
}

/*returns true if assertion passes validation*/
function assertion(obj = {}){
  let arr = [];
  arr.push(!!obj.key);
  arr.push(!!obj.relationship);
  if (obj.relationship && !obj.relationship.match('empty|notEmpty')){
    arr.push(!!obj.operand);
  }
  if (obj.key === 'header'){
    arr.push(!!obj.value);
  }
  return _.every(arr);
}

/*Returns an array of error objects with associated "areas" if any area fails*/
function check(obj = {}, areas = ['request', 'assertions', 'notifications', 'info']) {
  const spec = _.get(obj, 'spec') || {};
  const type = _.get(obj, 'target.type');
  let errors = [];

  //request area
  const requestErrors = [
    ['path', 'A check must include a path.'],
    ['port', 'A check must include a port.'],
    ['verb', 'A check must include a method.'],
    ['protocol', 'A check must specifiy a protocol.']
  ];

  if (type === 'host' || type === 'external_host'){
    const arr = requestErrors.map(err => {
      return !spec[err[0]];
    });
    if (_.some(arr)){
      errors.push('request: A URL check must include a valid URL.');
    }
  } else if (type && !type.match('rds|dbinstance')) {
    requestErrors.forEach(err => {
      if (!spec[err[0]]){
        errors.push(`request: ${err[1]}`);
      }
    });
  }

  let numberOfIncompleteHeaders = 0;
  if (Array.isArray(spec.headers)){
    const headers = spec.headers.map((h = {}) => {
      return h.name && h.values && h.values.length;
    });
    numberOfIncompleteHeaders = headers.length - _.compact(headers).length;
  }
  let parts = getVerbAndSuffix(numberOfIncompleteHeaders);
  if (numberOfIncompleteHeaders > 0){
    errors.push(`request: ${numberOfIncompleteHeaders} header${parts.suffix} ${parts.verb} incomplete.`);
  }

  //assertions area
  const assertions = obj.assertions.map((a = {}) => {
    return assertion(a);
  });
  const numberOfIncompleteAssertions = assertions.length - _.compact(assertions).length;
  parts = getVerbAndSuffix(numberOfIncompleteAssertions);
  if (numberOfIncompleteAssertions > 0){
    errors.push(`assertions: ${numberOfIncompleteAssertions} assertion${parts.suffix} ${parts.verb} incomplete.`);
  } else if (!assertions.length){
    errors.push('assertions: A check must have at least one assertion.');
  }

  //notifications area
  const notifs = obj.notifications.map((n = {}) => {
    return n.type && n.value;
  });
  const numberOfIncompleteNotifs = notifs.length - _.compact(notifs).length;
  parts = getVerbAndSuffix(numberOfIncompleteNotifs);
  if (numberOfIncompleteNotifs > 0){
    errors.push(`notifications: ${numberOfIncompleteNotifs} notification${parts.suffix} ${parts.verb} incomplete.`);
  } else if (!notifs.length){
    errors.push('notifications: A check must have at least one notification.');
  }

  //info area
  if (!obj.name){
    errors.push('info: A check must have a name.');
  }

  errors = errors.map(e => {
    const data = e.split(': ');
    return {
      area: data[0],
      error: data[1]
    };
  });
  return _.reject(errors, e => {
    return areas.indexOf(e.area) === -1;
  });
}

export default {
  assertion,
  check
};