import config from '../modules/config';
import Flux from '../modules/flux';
import storage from '../modules/storage';
import './User'
import _ from 'lodash';
import GlobalStore from './Global';
import $q from 'q';

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
  regions:[],//['us-west-1', 'us-east-1'],
  'access-key':null,
  'secret-key':null,
  vpcs:[]
}

let _data = {
  bastionHasLaunched:false,
  bastionLaunchHasBeenChecked:false
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
    getBastionHasLaunchedPromise(){
      var d = $q.defer();
      if(_data.bastionHasLaunched || _data.bastionLaunchHasBeenChecked){
        d.resolve(_data.bastionHasLaunched);
      }else{
        setTimeout(() => {
          _data.bastionLaunchHasBeenChecked = true;
          d.resolve(_data.bastionHasLaunched);
        },17000);
      }
      return d.promise;
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
    },
    getFinalInstallData(){
      let relation = _installData.vpcs.map(function(v){
        Store.getAvailableVpcs().forEach(
          function(r){
            r.vpcs.forEach(function(rvpc){
              if(rvpc['vpc-id'] == v){
                v = {id:v,region:r.region}
              }
            })
          });
        return v.id ? v : false;
      });
      if(!_.every(relation) || !relation.length){
        return false;
      }
      //TODO fix this so it works with multiple vpcs later
      relation = relation.map(r => {
        return {
          region:r.region,
          vpcs:[{id:r.id}]
        }
      });
      let aggregate = _.assign({}, _installData, {regions:relation}, {'instance-size':'t2.micro'});
      delete aggregate.vpcs;
      return aggregate;
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
        _teamData = _.assign(_teamData, payload.data);
        Store.emitChange();
      break;
      case 'ONBOARD_SET_REGIONS':
        _installData.regions = [payload.data];
        if(window.location.host.match('localhost')){
          _installData.regions = ['us-west-1']
        }
        Store.emitChange();
      break;
      case 'ONBOARD_SET_CREDENTIALS':
        _installData = _.assign(_installData, payload.data);
        Store.emitChange();
      break;
      case 'ONBOARD_VPC_SCAN_SUCCESS':
        _availableVpcs = payload.data;
        Store.emitChange();
      break;
      case 'ONBOARD_VPC_SCAN_ERROR':
      break;
      case 'ONBOARD_SET_VPCS':
        const data = Array.isArray(payload.data) ? payload.data : [payload.data];
        _installData = _.assign(_installData, {vpcs:data});
        Store.emitChange();
      break;
      case 'GLOBAL_SOCKET_MESSAGE':
        if(payload.data && payload.data.command && payload.data.command == 'launch-bastion'){
          _data.bastionLaunchHasBeenChecked = true;
          _data.bastionHasLaunched = true;
          Store.emitChange();
        }
      break;
      case 'ONBOARD_SET_PASSWORD_SUCCESS':
        _data.bastionLaunchHasBeenChecked = true;
      break;
      case 'ONBOARD_INSTALL':
        _data.bastionLaunchHasBeenChecked = true;
        _data.bastionHasLaunched = true;
        console.info('Launching Bastion');
        Store.emitChange();
      break;
    }
    _statuses = Flux.statics.statusProcessor(payload, _statuses, Store);
  }
)

export default Store;
