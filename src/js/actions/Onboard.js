import config from '../modules/config';
import Flux from '../modules/flux';
import request from '../modules/request';
import _ from 'lodash';
import {UserStore} from '../stores';
import example from '../../files/bastion-install-messages-example.json';

let _actions = {};

_actions.onboardSignupCreate = Flux.statics.addAsyncAction('onboardSignupCreate',
  (data) => {
    return request
    .post(`${config.authApi}/signups`)
    .send(data);
  },
  res => res && res.body,
  res => res && res.response
);

_actions.onboardSetPassword = Flux.statics.addAsyncAction('onboardSetPassword',
  (data) => {
    return request
    .post(`${config.authApi}/signups/${data.id}/claim`)
    .send(data);
  },
  res => res && res.body,
  res => res && res.response
);

_actions.subdomainAvailability = Flux.statics.addAsyncAction('subdomainAvailability',
  (subdomain, date) => {
    return request
    .get(`${config.api}/orgs/subdomain/${subdomain}`)
    .set('Authorization', UserStore.getAuth())
    .send({date: date});
  },
  res => {
    if (res && res.body){
      return {
        available: res.body.available,
        date: res.req._data.date
      };
    }
  },
  res => res && res.response
);

_actions.onboardCreateOrg = Flux.statics.addAsyncAction('onboardCreateOrg',
  (data) => {
    return request
    .post(`${config.api}/orgs`)
    .set('Authorization', UserStore.getAuth())
    .send(data);
  },
  res => res && res.body,
  res => res && res.response
);

_actions.onboardSetRegions = Flux.statics.addAction('onboardSetRegions');

_actions.onboardSetRegions = Flux.statics.addAction('onboardSetRegions');

_actions.onboardSetCredentials = Flux.statics.addAction('onboardSetCredentials');

_actions.onboardVpcScan = Flux.statics.addAsyncAction('onboardVpcScan',
  (data) => {
    return request
    .post(`${config.api}/scan-vpcs`)
    .set('Authorization', UserStore.getAuth())
    .send(data);
  },
  res => res && res.body,
  res => res && res.response
);

_actions.onboardSetVpcs = Flux.statics.addAction('onboardSetVpcs');

_actions.onboardInstall = Flux.statics.addAsyncAction('onboardInstall',
  (data) => {
    return request
    .post(`${config.api}/bastions/launch`)
    .set('Authorization', UserStore.getAuth())
    .send(data);
  },
  res => res && res.body,
  res => res && res.response
);

_actions.getBastions = Flux.statics.addAsyncAction('getBastions',
  (data) => {
    return request
    .get(`${config.api}/bastions`)
    .set('Authorization', UserStore.getAuth());
  },
  res => _.get(res, 'body.bastions') || [],
  res => res && res.response
);

_actions.onboardExampleInstall = Flux.statics.addAsyncAction('onboardExampleInstall',
  (data) => {
    return new Promise((resolve, reject) => {
      return resolve(example);
    });
  },
  res => res,
  res => res
);

export default _.assign({}, ..._.values(_actions));