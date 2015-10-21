import _ from 'lodash';
import config from '../modules/config';
import Flux from '../modules/flux';
import request from '../modules/request';
import {UserStore, CheckStore} from '../stores';

let _actions = {};

_actions.checkSilence = Flux.statics.addAction('checkSilence');

let _statics = {};

_statics.formatCheckData = function(data){
  const disallowed = ['assertions', 'notifications', 'instances', 'health', 'state', 'silenceDate', 'silenceDuration', 'id', 'name'];
  if(data.target.type == 'security'){
    data.target.type = 'sg';
  }
  return _.omit(data, disallowed);
}

_statics.saveNotifications = function(data, checkId, isEditing){
  return request
  [isEditing ? 'put' : 'post'](`${config.eventsApi}/notifications${isEditing ? '/'+checkId : ''}`)
  .set('Authorization', UserStore.getAuth())
  .send({
    'check-id':checkId,
    notifications:data.notifications
  })
}

_statics.saveAssertions = function(data, checkId, isEditing){
  return request
  [isEditing ? 'put' : 'post'](`${config.eventsApi}/assertions${isEditing ? '/'+checkId : ''}`)
  .set('Authorization', UserStore.getAuth())
  .send({
    'check-id':checkId,
    assertions:data.assertions
  })
}

_statics.checkCreateOrEdit = function(data, isEditing){
  return new Promise((resolve, reject) => {
    const d = _statics.formatCheckData(data);
    request
    [isEditing ? 'put' : 'post'](`${config.api}/checks${isEditing ? '/'+data.id : ''}`)
    .set('Authorization', UserStore.getAuth())
    .send(d).then(checkRes =>{
      //REMOVE and go back to this when bartnet is better
      if(true){
      // if(checkRes && checkRes.body){
        _statics.saveNotifications(data, _.get(checkRes, 'body.id') || data.id, isEditing)
        .then(notifRes => {
          _statics.saveAssertions(data, _.get(checkRes, 'body.id') || data.id, isEditing).then(assertionRes => {
            resolve(checkRes);
          })
        })
      }else{
        reject(checkRes);
      }
    })
  });
}

_actions.checkCreate = Flux.statics.addAsyncAction('checkCreate',
  (data) => {
    return _statics.checkCreateOrEdit(data);
  },
  res => res.body,
  res => res && res.body || res
);

_actions.checkEdit = Flux.statics.addAsyncAction('checkEdit',
  (data) => {
    return _statics.checkCreateOrEdit(data, true);
  },
  res => res.body,
  res => res && res.body || res
);

_actions.getCheck = Flux.statics.addAsyncAction('getCheck',
  (id) => {
    return new Promise((resolve, reject) => {
      request
      .get(`${config.api}/checks/${id}`)
      .set('Authorization', UserStore.getAuth())
      .then((checkRes) => {
        let check = checkRes.body;
        request
        .get(`${config.eventsApi}/notifications/${id}`)
        .set('Authorization', UserStore.getAuth())
        .then(notifRes => {
          check.notifications = notifRes.body.notifications;
          request
          .get(`${config.eventsApi}/assertions/${id}`)
          .set('Authorization', UserStore.getAuth())
          .then(assertionRes => {
            check.assertions = assertionRes.body.assertions;
            resolve(check);
          })
        })
        .catch(notifRes => {
          reject(_.get(notifRes.body || notifRes));
        })
      })
    })
  },
  res => res,
  res => _.get(res.body) || res
)

_actions.deleteCheck = Flux.statics.addAsyncAction('deleteCheck',
  (id) => {
    return request
    .del(`${config.api}/checks/${id}`)
    .set('Authorization', UserStore.getAuth())
  },
  res => res.body,
  res => _.get(res.body) || res
);

_actions.getChecks = Flux.statics.addAsyncAction('getChecks',
  (id) => {
    return request
    .get(`${config.api}/checks`)
    .set('Authorization', UserStore.getAuth())
  },
  res => res.body,
  res => res && res.body
);

_actions.testCheck = Flux.statics.addAsyncAction('testCheck',
  (data) => {
    if(config.demo){
      return new Promise((resolve, reject) => {
        resolve({body:CheckStore.getFakeResponse().toJS()});
      });
    }else{
      let newData = _statics.formatCheckData(data);
      return request
      .post(`${config.api}/bastions/test-check`)
      .set('Authorization', UserStore.getAuth())
      .send({check:newData, max_hosts:3, deadline:'30s'})
    }
  },
  res => res.body,
  res => _.get(res.body) || res
);

export default _.assign({}, ..._.values(_actions));