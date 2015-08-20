import constants from '../constants';
import Flux from '../Flux';
import storage from '../storage';
import './User'
import _ from 'lodash';

let _statuses = {
  onboardSignupCreate:null,
  onboardSetPassword:null,
  subdomainAvailability:null,
  onboardCreateOrg:null,
  onboardVpcScan:null
};

let _teamData = {
  customer_id:null,
  subdomain:null
}

let _installData = {
  regions:['us-west-1', 'us-east-1'],
  'access-key':null,
  'secret-key':null,
  vpcs:[]
}

let _availableVpcs = [];

let _domainPromisesArray = [];
let _subdomainAvailable;

const Store = Flux.createStore(
  {
    getSignupCreateStatus(){
      return _statuses.onboardSignupCreate;
    },
    getSetPasswordStatus(){
      return _statuses.onboardSetPassword;
    },
    getInstallData(){
      return _installData;
    },
    getSubdomainAvailable(){
      return _subdomainAvailable;
    },
    getSubdomainAvailabilityStatus(){
      return _statuses.subdomainAvailability;
    },
    getCreateOrgStatus(){
      return _statuses.onboardCreateOrg;
    },
    getVpcScanStatus(){
      return _statuses.onboardVpcScan;
    },
    getAvailableVpcs(){
      return _availableVpcs;
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
      case 'ONBOARD_CREATE_ORG':
      _teamData = _.extend(_teamData, payload.data);
      break;
      case 'ONBOARD_SET_REGIONS':
      console.log(payload.data);
      _installData.regions = payload.data;
      break;
      case 'ONBOARD_SET_CREDENTIALS':
      _installData = _.extend(_installData, payload.data);
      break;
      case 'ONBOARD_VPC_SCAN_SUCCESS':
      _availableVpcs = payload.data;
      break;
      case 'ONBOARD_SET_VPCS':
      _installData = _.extend(_installData, payload.data);
      break;
      case 'ONBOARD_INSTALL':
      console.log(_installData);
      break;
      case 'ONBOARD_EXAMPLE_INSTALL_SUCCESS':
      console.log(payload.data);
      break;
    }
    _statuses = Flux.statics.statusProcessor(payload, _statuses);
    Store.emitChange();
  }
)

export default Store;
