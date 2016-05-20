import _ from 'lodash';
import {handleActions} from 'redux-actions';
import config from '../modules/config';
import {regions, yeller} from '../modules';
import {
  ONBOARD_SET_REGION,
  ONBOARD_SET_CREDENTIALS,
  ONBOARD_SET_VPC,
  ONBOARD_SET_INSTALL_DATA,
  ONBOARD_SET_SUBNET,
  ONBOARD_INSTALL,
  ONBOARD_GET_TEMPLATES,
  ONBOARD_MAKE_LAUNCH_TEMPLATE,
  ONBOARD_SCAN_REGION,
  ONBOARD_HAS_ROLE
} from '../actions/constants';

const initial = {
  regions,
  templates: [],
  regionLaunchURL: null,

  role: {
    stack_id: null,
    region: null
  },

  // THE CURRENTLY SELECTED REGION, INCLUDING VPCS and SUBNETS
  selectedRegion: null,
  selectedSubnet: null,
  selectedVPC: null,

  installData: null,
  finalInstallData: null, // TODO couple more (?) w/ installData
  installing: false
};

export const statics = {
  getNameFromTags(vpcOrSubnet) {
    const tags = _.get(vpcOrSubnet, 'tags', []);
    return _.chain(tags).filter(t => _.get(t, 'Key') === 'Name').head().get('Value').value();
  },
  getFinalInstallData(state, installData){
    return {
      instance_size: 't2.micro',
      region: _.get(installData, 'region.id'),
      vpc_id: _.get(installData, 'vpc.vpc_id'),
      subnet_id: _.get(installData, 'subnet.subnet_id'),
      subnet_routing: _.get(installData, 'subnet.routing'),
      access_key: config.access_key,
      secret_key: config.secret_key
    };
  },
  formatVPCs(regionData) {
    return _.chain(regionData).get('vpcs').map(vpc => {
      let id = _.get(vpc, 'vpc_id');
      let name = statics.getNameFromTags(vpc);
      let labelName = vpc.name ? `<strong>${vpc.name}</strong> - ` : '';
      let label = `${labelName}${id}<br/><small>(${_.get(vpc, 'instance_count')} instances)</small>`;
      return _.assign({ id, name, label }, vpc);
    }).value();
  },
  formatSubnets(regionData) {
    return _.chain(regionData).get('subnets').map(subnet => {
      let id = _.get(subnet, 'subnet_id');
      let name = statics.getNameFromTags(subnet);
      let labelName = subnet.name ? `<strong>${subnet.name}</strong> - ` : '';
      let label = `${labelName}${id}<br/><small>(${_.get(subnet, 'instance_count')} instances, ${_.get(subnet, 'routing')} routing)</small><br/><small>${_.get(subnet, 'vpc_id')}</small>`;
      return _.assign({ id, name, label }, subnet);
    }).value();
  }
};

export default handleActions({
  [ONBOARD_GET_TEMPLATES]: {
    next(state, action){
      const templates = action.payload;
      return _.assign({}, state, {templates});
    },
    throw: yeller.reportAction
  },
  [ONBOARD_SET_CREDENTIALS]: {
    next(state, action){
      return _.assign({}, state, action.payload);
    }
  },
  [ONBOARD_SCAN_REGION]: {
    next(state, action) {
      const regionData = action.payload.data;
      const id = _.get(regionData, 'region');

      // Use the "Name" tag as name, if present
      const vpcs = statics.formatVPCs(regionData);
      const subnets = statics.formatSubnets(regionData);

      const selectedRegion = { id, vpcs, subnets };
      return _.assign({}, state, { selectedRegion });
    },
    throw: yeller.reportAction
  },
  [ONBOARD_SET_REGION]: {
    next(state, action){
      const id = _.get(action.payload, 'region');
      const selectedRegion = { id };
      return _.assign({}, state, { selectedRegion });
    }
  },
  [ONBOARD_SET_VPC]: {
    next(state, action){
      const selectedVPC = action.payload;
      const selectedSubnet = null;
      return _.assign({}, state, {selectedVPC, selectedSubnet});
    }
  },
  [ONBOARD_SET_SUBNET]: {
    next(state, action){
      const selectedSubnet = action.payload;
      const subnet = _.find(state.selectedRegion.subnets, { subnet_id: selectedSubnet });
      const selectedVPC = _.get(subnet, 'vpc_id');
      return _.assign({}, state, {selectedVPC, selectedSubnet});
    }
  },
  [ONBOARD_SET_INSTALL_DATA]: {
    next(state, action) {
      const { regionID, vpcID, subnetID } = action.payload.data;

      // Store the complete region/vpc/subnet in the props, since selected
      // region/vpc/subnet can change
      const region = _.find(regions, {id: regionID });
      const vpc = _.find(state.selectedRegion.vpcs, {vpc_id: vpcID});
      const subnet = _.find(state.selectedRegion.subnets, {subnet_id: subnetID});

      const installData = { region, vpc, subnet };
      const finalInstallData = statics.getFinalInstallData(state, installData);
      return _.assign({}, state, { installData, finalInstallData });
    }
  },
  [ONBOARD_INSTALL]: {
    next(state){
      return _.assign({}, state, {installing: true});
    }
  },
  [ONBOARD_MAKE_LAUNCH_TEMPLATE]: {
    next(state, action){
      const regionLaunchURL = atob(_.get(action.payload, 'data'));
      return _.assign({}, state, {regionLaunchURL});
    },
    throw: yeller.reportAction
  },
  [ONBOARD_HAS_ROLE]: {
    next(state, action) {
      const role = action.payload.data;
      return _.assign({}, state, {role});
    },
    throw: yeller.reportAction
  }
}, initial);