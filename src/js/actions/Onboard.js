import constants from '../constants';
import Flux from '../Flux';
import request from '../request';
import _ from 'lodash';
import UserStore from '../stores/User';

const signupCreate = Flux.statics.addAsyncAction('signupCreate',
  (data) => {
    return request
    .post(`${constants.api}/signups`)
    .send(data)
  },
  res => res && res.body,
  res => res && res.response
);

const setPassword = Flux.statics.addAsyncAction('setPassword',
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

const createOrg = Flux.statics.addAsyncAction('createOrg',
  (data) => {
    return request
    .post(`${constants.api}/orgs`)
    .set('Authorization', UserStore.getAuth())
    .send(data)
  },
  res => res && res.body,
  res => res && res.response
);

const setRegions = Flux.createActions({
  setRegions(data){
    return {
      actionType: 'ONBOARD_SET_REGIONS',
      data:data
    }
  }
});

export default _.assign({}, signupCreate, setPassword, subdomainAvailability, createOrg, setRegions);