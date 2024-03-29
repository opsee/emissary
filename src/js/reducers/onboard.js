import _ from 'lodash';
import {handleActions} from 'redux-actions';
import config from '../modules/config';
import {regions, storage, yeller} from '../modules';
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
  ONBOARD_HAS_ROLE,
  ONBOARD_SET_DEFAULT_NOTIFS,
  ONBOARD_GET_DEFAULT_NOTIFS,
  ONBOARD_SKIP_DEFAULT_NOTIFS,
  USER_LOGIN
} from '../actions/constants';

const initial = {
  regions,
  templates: [],
  regionLaunchURL: null,
  role: {
    stack_id: null,
    region: null
  },
  defaultNotifs: [],
  skippedDefaultNotifs: false,
  // The currently selected region on the /start/config-instance screen.
  // The region contains all of its vpcs and subnets.
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
      let labelName = name ? `<strong>${name}</strong> - ` : '';
      let label = `${labelName}${id}<br/><small>${_.get(vpc, 'instance_count')} instances</small>`;
      return _.assign({ id, name, label }, vpc);
    }).value();
  },
  formatSubnets(regionData) {
    return _.chain(regionData).get('subnets').map(subnet => {
      let id = _.get(subnet, 'subnet_id');
      let name = statics.getNameFromTags(subnet);
      let labelName = name ? `<strong>${name}</strong> - ` : '';
      let label = `${labelName}${id}<br/><small>${_.get(subnet, 'instance_count')} instances, ${_.get(subnet, 'routing')} routing</small>`;
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
      const selectedVPC = null;
      const selectedSubnet = null;
      return _.assign({}, state, { selectedRegion, selectedVPC, selectedSubnet });
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
      // Store the complete region/vpc/subnet in the props, since selected
      // region/vpc/subnet can change
      const { regionID, vpcID, subnetID } = action.payload.data;
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
  },
  [ONBOARD_SET_DEFAULT_NOTIFS]: {
    next(state, action) {
      const defaultNotifs = action.payload.data;
      return _.assign({}, state, {defaultNotifs});
    },
    throw: yeller.reportAction
  },
  [ONBOARD_GET_DEFAULT_NOTIFS]: {
    next(state, action) {
      let defaultNotifs = action.payload.data;
      if (!defaultNotifs || !defaultNotifs.length){
        const value = _.get(storage.get('user'), 'email');
        defaultNotifs = [{type: 'email', value}];
      }
      return _.assign({}, state, {defaultNotifs});
    },
    throw: yeller.reportAction
  },
  [ONBOARD_SKIP_DEFAULT_NOTIFS]: {
    next(state) {
      return _.assign({}, state, { skippedDefaultNotifs: true });
    }
  },
  [USER_LOGIN]: {
    next(state, action){
      if (!state.defaultNotifs.length){
        const defaultNotifs = [{type: 'email', value: _.get(action, 'payload.user.email')}];
        return _.assign({}, state, {defaultNotifs});
      }
      return state;
    }
  }
}, initial);