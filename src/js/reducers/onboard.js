import _ from 'lodash';
import {handleActions} from 'redux-actions';
import config from '../modules/config';
import {yeller} from '../modules';
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
  'access_key': config.access_key,
  'secret_key': config.secret_key,
  region: config.region,
  selectedSubnet: null,
  selectedVPC: null,

  vpcs: {},
  subnets: {},

  vpcsForSelection: [],
  subnetsForSelection: [],
  bastionLaunching: undefined,
  installData: undefined,
  installing: false,
  templates: [],
  regionLaunchURL: null,
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
  getFinalInstallData(state){
    const subnet = _.chain(state.subnetsForSelection)
      .filter(s => {
        return s.subnet_id === state.selectedSubnet;
      })
      .head().value() || {};
    return {
      instance_size: 't2.micro',
      region: state.region,
      vpc_id: state.selectedVPC,
      subnet_id: state.selectedSubnet,
      subnet_routing: subnet.routing,
      access_key: state.access_key,
      secret_key: state.secret_key
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
  [ONBOARD_SET_REGION]: {
    next(state, action){
      const region = action.payload;
      console.log(region);
      return _.assign({}, state, region);
    }
  },
  [ONBOARD_SET_VPC]: {
    next(state, action){
      const selectedVPC = action.payload;
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
    next(state){
      const installData = statics.getFinalInstallData(state);
      return _.assign({}, state, {installData});
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
  [ONBOARD_SCAN_REGION]: {
    next(state, action) {
      // Use the "Name" tag as name, if present
      const vpcsForSelection = _.chain(action.payload.data).get('vpcs').map(vpc => {
        return _.assign({}, vpc, { name: statics.getNameFromTags(vpc) });
      }).value();
      const subnetsForSelection = _.chain(action.payload.data).get('subnets').map(subnet => {
        return _.assign({}, subnet, { name: statics.getNameFromTags(subnet) });
      }).value();
      const newState = { vpcsForSelection, subnetsForSelection };
      if (!state.selectedVPC) {
        newState.selectedVPC = _.get(_.first(vpcsForSelection), 'vpc_id');
      }
      if (!state.selectedSubnet) {
        newState.selectedSubnet = _.get(_.first(subnetsForSelection), 'subnet_id');
      }
      return _.assign({}, state, newState);
    },
    throw: yeller.reportAction
  },
  [ONBOARD_HAS_ROLE]: {
    next(state, action) {
      const role = action.payload.data;
      const region = _.get(action.payload.data, 'region');
      return _.assign({}, state, {role, region});
    },
    throw: yeller.reportAction
  }
}, initial);