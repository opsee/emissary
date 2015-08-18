import constants from '../constants';
import Flux from '../Flux';
import request from 'superagent';
import storage from '../storage';
import './User'
import _ from 'lodash';

// data storage
let _user = storage.get('user') || {
  name:null,
  email:null,
  id:null,
  token:null
}

let _statuses = {
  signupCreate:null,
  setPassword:null,
  subdomainAvailability:null,
  createOrg:null
};

let _data = {
  customer_id:null,
  domain:null,
  regions:[]
}

let _domainPromisesArray = [];
let _subdomainAvailable;

const Store = Flux.createStore(
  {
    getSignupCreateStatus(){
      return _statuses.signupCreate;
    },
    getSetPasswordStatus(){
      return _statuses.setPassword;
    },
    getData(){
      return _data;
    },
    getSubdomainAvailable(){
      return _subdomainAvailable;
    },
    getSubdomainAvailabilityStatus(){
      return _statuses.subdomainAvailability;
    },
    getCreateOrgStatus(){
      return _statuses.createOrg;
    }
  }, function(payload){
    switch(payload.actionType) {
      case 'SIGNUP_CREATE_SUCCESS':
        // loginSuccess(payload.data);
      break;
      case 'SUBDOMAIN_AVAILABILITY_SUCCESS':
        _domainPromisesArray.push(payload.data);
        _domainPromisesArray = _.sortBy(_domainPromisesArray, 'date');
        _subdomainAvailable = _.last(_domainPromisesArray);
      break;
      case 'ONBOARD_SET_REGIONS':
      console.log(payload.data);
      _data.regions = payload.data;
      break;
    }
    _statuses = Flux.statics.statusProcessor(payload, _statuses);
    Store.emitChange();
  }
)

export default Store;
