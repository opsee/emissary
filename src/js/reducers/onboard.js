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
  region: null,

  selectedSubnet: null,
  selectedVPC: null,
  vpcsForSelection: [],
  subnetsForSelection: [],
  bastionLaunching: undefined,
  installData: null,
  finalInstallData: null, // TODO couple more (?) w/ installData
  installing: false,
  templates: [],
  regionLaunchURL: null,

  // THE CURRENTLY SELECTED REGION, INCLUDING VPCS and SUBNETS
  selectedRegion: null,

  role: {
    stack_id: null,
    region: null
  }
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
      // Use the "Name" tag as name, if present
      const vpcsForSelection = _.chain(action.payload.data).get('vpcs').map(vpc => {
        return _.assign({}, vpc, { name: statics.getNameFromTags(vpc) });
      }).value();
      const subnetsForSelection = _.chain(action.payload.data).get('subnets').map(subnet => {
        return _.assign({}, subnet, { name: statics.getNameFromTags(subnet) });
      }).value();
      return _.assign({}, state, { vpcsForSelection, subnetsForSelection });
    },
    throw: yeller.reportAction
  },
  [ONBOARD_SET_REGION]: {
    next(state, action){
      const region = action.payload;
      // TODO set best choice VPC and subnet as selected
      return _.assign({}, state, region);
    }
  },
  [ONBOARD_SET_VPC]: {
    next(state, action){
      const selectedVPC = action.payload;
      // TODO set best subnet as selected
      return _.assign({}, state, {selectedVPC});
    }
  },
  [ONBOARD_SET_SUBNET]: {
    next(state, action){
      const selectedSubnet = action.payload;
      return _.assign({}, state, {selectedSubnet});
    }
  },
  [ONBOARD_SET_INSTALL_DATA]: {
    next(state, action) {
      const { regionID, vpcID, subnetID } = action.payload.data;

      // Store the complete region/vpc/subnet in the props, since selected
      // region/vpc/subnet can change
      const region = _.find(regions, {id: regionID });
      const vpc = _.find(state.vpcsForSelection, {vpc_id: vpcID});
      const subnet = _.find(state.subnetsForSelection, {subnet_id: subnetID});

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
      const region = _.get(action.payload.data, 'region');
      console.log('role', role);
      return _.assign({}, state, {role, region});
    },
    throw: yeller.reportAction
  }
}, initial);