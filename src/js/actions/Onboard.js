import constants from '../constants';
import Flux from '../Flux';
import request from '../request';
import _ from 'lodash';
import UserStore from '../stores/User';

const onboardSignupCreate = Flux.statics.addAsyncAction('onboardSignupCreate',
  (data) => {
    return request
    .post(`${constants.api}/signups`)
    .send(data)
  },
  res => res && res.body,
  res => res && res.response
);

const onboardSetPassword = Flux.statics.addAsyncAction('onboardSetPassword',
  (data) => {
    return request
    .post(`${constants.api}/activations/${data.token}/activate`)
    .send(data)
  },
  res => res && res.body,
  res => res && res.response
);

const subdomainAvailability = Flux.statics.addAsyncAction('subdomainAvailability',
  (subdomain, date) => {
    return request
    .get(`${constants.api}/orgs/subdomain/${subdomain}`)
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

const onboardCreateOrg = Flux.statics.addAsyncAction('onboardCreateOrg',
  (data) => {
    return request
    .post(`${constants.api}/orgs`)
    .set('Authorization', UserStore.getAuth())
    .send(data)
  },
  res => res && res.body,
  res => res && res.response
);

const onboardSetRegions = Flux.createActions({
  onboardSetRegions(data){
    return {
      actionType:'ONBOARD_SET_REGIONS',
      data:data
    }
  }
});

const onboardSetCredentials = Flux.createActions({
  onboardSetCredentials(data){
    return {
      actionType:'ONBOARD_SET_CREDENTIALS',
      data:data
    }
  }
});

const onboardVpcScan = Flux.statics.addAsyncAction('onboardVpcScan',
  (data) => {
    return request
    .post(`${constants.api}/scan-vpcs`)
    .set('Authorization', UserStore.getAuth())
    .send(data)
  },
  res => res && res.body,
  res => res && res.response
);

const onboardSetVpcs = Flux.createActions({
  onboardSetVpcs(data){
    return {
      actionType:'ONBOARD_SET_VPCS',
      data:data
    }
  }
});

const onboardInstall = Flux.createActions({
  onboardInstall(data){
    return {
      actionType:'ONBOARD_INSTALL',
      data:data
    }
  }
});

export default _.assign({}, onboardSignupCreate, onboardSetPassword, subdomainAvailability, onboardCreateOrg, onboardSetRegions, onboardSetCredentials, onboardVpcScan);