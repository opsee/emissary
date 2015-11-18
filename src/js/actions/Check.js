import _ from 'lodash';
import config from '../modules/config';
import Flux from '../modules/flux';
import request from '../modules/request';
import {UserStore, CheckStore} from '../stores';

let _actions = {};

_actions.checkSilence = Flux.statics.addAction('checkSilence');

let _statics = {};

_statics.formatCheckData = (data) => {
  const disallowed = ['assertions', 'notifications', 'instances', 'health', 'state', 'silenceDate', 'silenceDuration', 'id', 'results', 'passing', 'total'];
  if (data.target.type === 'security'){
    data.target.type = 'sg';
  }
  if (data.target.type === 'EC2'){
    data.target.type = 'instance';
  }
  return _.omit(data, disallowed);
};

_statics.saveNotifications = (data, checkId, isEditing) => {
  return request
  [isEditing ? 'put' : 'post'](`${config.api}/notifications${isEditing ? '/' + checkId : ''}`)
  .set('Authorization', UserStore.getAuth())
  .send({
    'check-id': checkId,
    notifications: data.notifications
  });
};

_statics.saveAssertions = (data, checkId, isEditing) => {
  return request
  [isEditing ? 'put' : 'post'](`${config.api}/assertions${isEditing ? '/' + checkId : ''}`)
  .set('Authorization', UserStore.getAuth())
  .send({
    'check-id': checkId,
    assertions: data.assertions
  });
};

_statics.checkCreateOrEdit = (data, isEditing) => {
  return new Promise((resolve, reject) => {
    const d = _statics.formatCheckData(data);
    request
    [isEditing ? 'put' : 'post'](`${config.api}/checks${isEditing ? '/' + data.id : ''}`)
    .set('Authorization', UserStore.getAuth())
    .send(d).then(checkRes =>{
      _statics.saveNotifications(data, _.get(checkRes, 'body.id') || data.id, isEditing)
      .then(() => {
        _statics.saveAssertions(data, _.get(checkRes, 'body.id') || data.id, isEditing).then(() => {
          resolve(checkRes);
        }).catch(reject);
      }).catch(reject);
    }).catch(reject);
  });
};

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
        .get(`${config.api}/notifications/${id}`)
        .set('Authorization', UserStore.getAuth())
        .then(notifRes => {
          check.notifications = notifRes.body.notifications;
          request
          .get(`${config.api}/assertions/${id}`)
          .set('Authorization', UserStore.getAuth())
          .then(assertionRes => {
            check.assertions = assertionRes.body.assertions;
            resolve(check);
          });
        })
        .catch(notifRes => {
          reject(_.get(notifRes.body || notifRes));
        });
      });
    });
  },
  res => res,
  res => _.get(res.body) || res
);

_actions.deleteCheck = Flux.statics.addAsyncAction('deleteCheck',
  (id) => {
    return request
    .del(`${config.api}/checks/${id}`)
    .set('Authorization', UserStore.getAuth());
  },
  res => res.body,
  res => _.get(res.body) || res
);

_actions.getChecks = Flux.statics.addAsyncAction('getChecks',
  () => {
    return new Promise((resolve, reject) => {
      request
      .get(`${config.api}/bastions`)
      .set('Authorization', UserStore.getAuth())
      .then(bastionRes => {
        const bastions = _.get(bastionRes, 'body.bastions') || [];
        if (!bastions.length){
          return reject({message: 'Bastion is disconnected or offline. <a href="/start/region-select">Click here to install one.</a>'});
        }
        request
        .get(`${config.api}/checks`)
        .set('Authorization', UserStore.getAuth())
        .then(res => {
          return resolve(_.get(res.body, 'checks') || res.body);
        }, reject);
      }, reject);
    });
  },
  checks => checks,
  res => res.body || res
);

_actions.testCheck = Flux.statics.addAsyncAction('testCheck',
  (data) => {
    if (config.demo){
      return new Promise((resolve) => {
        resolve({body: CheckStore.getFakeResponse().toJS()});
      });
    }
    let newData = _statics.formatCheckData(data);
    newData = _.assign(newData, {name: UserStore.getUser().get('email')});
    return request
    .post(`${config.api}/bastions/test-check`)
    .set('Authorization', UserStore.getAuth())
    .send({check: newData, max_hosts: 3, deadline: '30s'});
  },
  res => _.get(res, 'body.responses') || [],
  res => _.get(res.body) || res
);

_actions.resetTestCheck = Flux.statics.addAction('resetTestCheck');

export default _.assign({}, ..._.values(_actions));