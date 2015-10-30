import config from '../modules/config';
import Flux from '../modules/flux';
import './User';
import _ from 'lodash';
import $q from 'q';

/* eslint-disable no-use-before-define */

let _teamData = {
  customer_id: null,
  subdomain: null
};

let _installData = {
  regions: [],//['us-west-1', 'us-east-1'],
  'access-key': null,
  'secret-key': null,
  vpcs: []
};

let _data = {
  bastionHasLaunched: !!(config.demo) || false,
  bastionLaunchHasBeenChecked: false,
  availableVpcs: [],
  domainPromisesArray: [],
  subdomainAvailable: null,
  bastions: [],
  customer: {}
};

const _public = {
  getBastionHasLaunchedPromise(){
    const d = $q.defer();
    if (_data.bastionHasLaunched || _data.bastionLaunchHasBeenChecked){
      d.resolve(_data.bastionHasLaunched);
    }else {
      setTimeout(() => {
        _data.bastionLaunchHasBeenChecked = true;
        d.resolve(_data.bastionHasLaunched);
      }, 17000);
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
      'access-key': _installData['access-key'],
      'secret-key': _installData['secret-key'],
      regions: _installData.regions
    };
  },
  getAvailableVpcs(){
    return _data.availableVpcs;
  },
  getBastions(){
    return _data.bastions;
  },
  getCustomer(){
    return _data.customer;
  },
  getFinalInstallData(){
    let relation = _installData.vpcs.map((v) => {
      let newVpc;
      Store.getAvailableVpcs().forEach(r => {
        r.vpcs.forEach(rvpc => {
          if (rvpc['vpc-id'] === v){
            newVpc = {id: v, region: r.region};
          }
        });
      });
      return newVpc.id ? newVpc : false;
    });
    if (!_.every(relation) || !relation.length){
      return false;
    }
    //TODO fix this so it works with multiple vpcs later
    relation = relation.map(r => {
      return {
        region: r.region,
        vpcs: [{id: r.id}]
      };
    });
    let aggregate = _.assign({}, _installData, {regions: relation}, {'instance-size': 't2.micro'});
    delete aggregate.vpcs;
    return aggregate;
  }
};

const statics = {
  _statuses: {
    onboardSignupCreate: null,
    onboardSetPassword: null,
    subdomainAvailability: null,
    onboardCreateOrg: null,
    onboardVpcScan: null,
    getBastions: null,
    getCustomer: null
  }
};

const statusFunctions = Flux.statics.generateStatusFunctions(statics);

const Store = Flux.createStore(
  _.assign({}, _public, statusFunctions),
  function handlePayload(payload){
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
      _installData = _.assign(_installData, {vpcs: data});
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
    case 'GET_CUSTOMER_SUCCESS':
      _data.customer = payload.data;
      break;
    default:
      break;
    }
    const statusData = Flux.statics.statusProcessor(payload, statics, Store);
    statics._statuses = statusData.statuses;
    if (statusData.haveChanged){
      Store.emitChange();
    }
  }
);

export default Store;
