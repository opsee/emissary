import config from '../modules/config';
import Flux from '../modules/flux';
import request from '../modules/request';
import analytics from '../modules/analytics';
import _ from 'lodash';
import example from '../../files/bastion-install-messages-example.json';
import storage from '../modules/storage';

let _actions = {};

_actions.subdomainAvailability = Flux.statics.addAsyncAction('subdomainAvailability',
  (subdomain, date) => {
    return request
    .get(`${config.api}/orgs/subdomain/${subdomain}`)
    .set('Authorization', storage.get('user').auth)
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
    .set('Authorization', storage.get('user').auth)
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
    .set('Authorization', storage.get('user').auth)
    .send(data);
  },
  res => res && res.body,
  res => {
    let message = _.get(res, 'response.body.error') || res.response;
    return {message};
  }
);

_actions.onboardSetVpcs = Flux.statics.addAction('onboardSetVpcs');

_actions.onboardInstall = Flux.statics.addAsyncAction('onboardInstall',
  (data) => {
    analytics.event('Onboard', 'bastion-install', {data});
    return request
    .post(`${config.api}/bastions/launch`)
    .set('Authorization', storage.get('user').auth)
    .send(data);
  },
  res => res && res.body,
  res => _.get(res, 'response') || res
);

_actions.getBastions = Flux.statics.addAsyncAction('getBastions',
  () => {
    return request
    .get(`${config.api}/bastions`)
    .set('Authorization', storage.get('user').auth);
  },
  res => _.get(res, 'body.bastions') || [],
  res => res
);

_actions.getCustomer = Flux.statics.addAsyncAction('getCustomer',
  () => {
    return request
    .get(`${config.api}/customer`)
    .set('Authorization', storage.get('user').auth);
  },
  res => {
    let body = _.get(res, 'body.body');
    if (body){
      try {
        body = JSON.parse(body);
        return body.customer;
      }catch (err){
        return {};
      }
    }
    return {};
  },
  res => res
);

// let tried = 0;
// _actions.getBastions = Flux.statics.addAsyncAction('getBastions',
//   (data) => {
//     return new Promise((resolve, reject) => {
//       return setTimeout(() => {
//         tried++;
//         if (tried > 20){
//           resolve({body:{bastions:['foo']}});
//         }else{
//           resolve({body:{bastions:[]}});
//         }
//       },4000);
//     })
//   },
//   res => _.get(res, 'body.bastions') || [],
//   res => res && res.response
// );

_actions.onboardExampleInstall = Flux.statics.addAsyncAction('onboardExampleInstall',
  () => {
    return new Promise((resolve) => {
      return resolve(example);
    });
  },
  res => res,
  res => res
);

export default _.assign({}, ..._.values(_actions));