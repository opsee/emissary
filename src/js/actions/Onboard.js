import config from '../config';
import Flux from '../Flux';
import request from '../request';
import _ from 'lodash';
import UserStore from '../stores/User';

let _actions = {};

_actions.onboardSignupCreate = Flux.statics.addAsyncAction('onboardSignupCreate',
  (data) => {
    return request
    .post(`${config.api}/signups`)
    .send(data)
  },
  res => res && res.body,
  res => res && res.response
);

_actions.onboardSetPassword = Flux.statics.addAsyncAction('onboardSetPassword',
  (data) => {
    return request
    .post(`${config.api}/activations/${data.token}/activate`)
    .send(data)
  },
  res => res && res.body,
  res => res && res.response
);

_actions.subdomainAvailability = Flux.statics.addAsyncAction('subdomainAvailability',
  (subdomain, date) => {
    return request
    .get(`${config.api}/orgs/subdomain/${subdomain}`)
    .set('Authorization', UserStore.getAuth())
    .send({date:date})
  },
  res => {
    if(res && res.body){
      return {
        available:res.body.available,
        date:res.req._data.date
      }
    }
  },
  res => res && res.response
);

_actions.onboardCreateOrg = Flux.statics.addAsyncAction('onboardCreateOrg',
  (data) => {
    return request
    .post(`${config.api}/orgs`)
    .set('Authorization', UserStore.getAuth())
    .send(data)
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
    .send(data)
  },
  res => res && res.body,
  res => res && res.response
);

_actions.onboardSetVpcs = Flux.statics.addAction('onboardSetVpcs');

_actions.onboardInstall = Flux.statics.addAsyncAction('onboardInstall',
  (data) => {
    return request
    .post(`${config.api}/bastions/launch`)
    .send(data)
  },
  res => res && res.body,
  res => res && res.response
);

_actions.onboardExampleInstall = Flux.statics.addAsyncAction('onboardExampleInstall',
  (data) => {
    return request
    .get(`/img/bastion-install-messages-example.json`)
    .send(data)
  },
  res => res && res.body,
  res => res && res.response
);

export default _.assign({}, ..._.values(_actions));