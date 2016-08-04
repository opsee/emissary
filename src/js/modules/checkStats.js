import _ from 'lodash';

export default function(data = [], checkState){
  if (!data.length){
    return {
      passing: checkState.match('passing|ok') ? 100 : 0,
      failing: checkState.match('fail') ? 100: 0,
      warning: 0
    }
  }
  const arr = data.map(d => {
    return _.assign(d, {
      from: d.from.toLowerCase(),
      to: d.to.toLowerCase()
    });
  });
  return {
    passing: _.chain(arr).filter({to: 'ok'}).map('percent').sum().value(),
    failing: _.chain(arr).filter({to: 'fail'}).map('percent').sum().value(),
    warning: _.chain(arr).filter(a => a.to.match('wait|warn')).map('percent').sum().value()
  }
}