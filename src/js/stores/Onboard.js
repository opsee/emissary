import config from '../modules/config';
import Flux from '../modules/flux';
import storage from '../modules/storage';
import './User';
import _ from 'lodash';
import GlobalStore from './Global';
import $q from 'q';

let _statuses = {
  onboardSignupCreate:null,
  onboardSetPassword:null,
  subdomainAvailability:null,
  onboardCreateOrg:null,
  onboardVpcScan:null,
  getBastions:null
};

let _teamData = {
  customer_id:null,
  subdomain:null
};

let _installData = {
  regions:[],//['us-west-1', 'us-east-1'],
  'access-key':null,
  'secret-key':null,
  vpcs:[]
};

let _data = {
  bastionHasLaunched:!!(config.demo) || false,
  bastionLaunchHasBeenChecked:false,
  availableVpcs:[],
  domainPromisesArray:[],
  subdomainAvailable:null,
  bastions:[]
};

const _public = {
  getBastionHasLaunchedPromise(){
    var d = $q.defer();
    if (_data.bastionHasLaunched || _data.bastionLaunchHasBeenChecked){
      d.resolve(_data.bastionHasLaunched);
    }else {
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
    return _data.subdomainAvailable;
  },
  getVpcScanData(){
    return {
      'access-key':_installData['access-key'],
      'secret-key':_installData['secret-key'],
      regions:_installData.regions
    };
  },
  getAvailableVpcs(){
    return _data.availableVpcs;
  },
  getBastions(){
    return _data.bastions;
  },
  getFinalInstallData(){
    let relation = _installData.vpcs.map(function(v){
      Store.getAvailableVpcs().forEach(
        function(r){
          r.vpcs.forEach(function(rvpc){
            if (rvpc['vpc-id'] === v){
              v = {id:v,region:r.region};
            }
          });
        });
      return v.id ? v : false;
    });
    if (!_.every(relation) || !relation.length){
      return false;
    }
    //TODO fix this so it works with multiple vpcs later
    relation = relation.map(r => {
      return {
        region:r.region,
        vpcs:[{id:r.id}]
      };
    });
    let aggregate = _.assign({}, _installData, {regions:relation}, {'instance-size':'t2.micro'});
    delete aggregate.vpcs;
    return aggregate;
  }
};

let statusFunctions = {};
let keys = _.chain(_statuses).keys().map(k => {
  let arr = [k];
  arr.push('get' + _.startCase(k).split(' ').join('') + 'Status');
  return arr;
}).forEach(a => {
  statusFunctions[a[1]] = function(){
    return _statuses[a[0]];
  };
}).value();

const Store = Flux.createStore(
  _.assign({}, _public, statusFunctions),
  function(payload){
    switch (payload.actionType) {
    case 'SIGNUP_CREATE_SUCCESS':
        // loginSuccess(payload.data);
      break;
    case 'SUBDOMAIN_AVAILABILITY_SUCCESS':
      _data.domainPromisesArray.push(payload.data);
      _data.domainPromisesArray = _.sortBy(_data.domainPromisesArray, 'date');
      _data.subdomainAvailable = _.last(_data.domainPromisesArray);
      break;
    case 'ONBOARD_CREATE_ORG':
      _teamData = _.assign(_teamData, payload.data);
      Store.emitChange();
      break;
    case 'ONBOARD_SET_REGIONS':
      _installData.regions = [payload.data];
      if (window.location.host.match('localhost')){
          _installData.regions = ['us-west-1'];
        }
      Store.emitChange();
      break;
    case 'ONBOARD_SET_CREDENTIALS':
      _installData = _.assign(_installData, payload.data);
      Store.emitChange();
      break;
    case 'ONBOARD_VPC_SCAN_SUCCESS':
      _data.availableVpcs = payload.data;
      break;
    case 'ONBOARD_VPC_SCAN_ERROR':
      break;
    case 'ONBOARD_SET_VPCS':
      const data = Array.isArray(payload.data) ? payload.data : [payload.data];
      _installData = _.assign(_installData, {vpcs:data});
      Store.emitChange();
      break;
    case 'GLOBAL_SOCKET_MESSAGE':
      if (payload.data && payload.data.command && payload.data.command === 'launch-bastion'){
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
    case 'GET_BASTIONS_SUCCESS':
      _data.bastions = payload.data;
      break;
    }
    const statusData = Flux.statics.statusProcessor(payload, _statuses, Store);
    _statuses = statusData.statuses;
    if (statusData.haveChanged){
      Store.emitChange();
    }
  }
);

export default Store;
