import _ from 'lodash';
import {handleActions} from 'redux-actions';
import config from '../modules/config';
import {yeller} from '../modules';
import {plain as seed} from 'seedling';
import {
  ONBOARD_SET_REGION,
  ONBOARD_SET_CREDENTIALS,
  ONBOARD_VPC_SCAN,
  ONBOARD_VPC_SELECT,
  ONBOARD_SET_INSTALL_DATA,
  ONBOARD_SUBNET_SELECT,
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
  regionsWithVpcs: [],
  vpcsForSelection: [],
  subnetsForSelection: [],
  bastionLaunching: undefined,
  installData: undefined,
  installing: false,
  templates: [],
  regionLaunchURL: null,
  hasRole: false
};

function getFinalInstallData(state){
  const starter = {
    instance_size: 't2.micro'
  };
  const regions = _.chain(state.regionsWithVpcs).filter(region => {
    return _.find(region.subnets, v => v.selected);
  }).map(region => {
    return _.chain(region).pick(['region', 'subnets']).mapValues((value, key) => {
      if (key === 'subnets'){
        return _.chain(value).filter('selected').map(selected => {
          return _.chain(selected).pick(['subnet_id', 'vpc_id', 'routing']).mapKeys((childValue, childKey) => {
            switch (childKey){
            case 'routing':
              return 'subnet_routing';
            case 'vpc_id':
              return 'id';
            default:
              return childKey;
            }
          }).value();
        }).value();
      }
      return value;
    }).mapKeys((value, key) => {
      return key === 'subnets' ? 'vpcs' : key;
    }).value();
  }).value();
  return _.assign({}, starter, _.pick(state, ['access_key', 'secret_key']), {regions});
}

function generateSubnetsForSelection(regions){
  return _.chain(regions).map(region => {
    const selectedVpc = _.chain(region)
    .get('vpcs')
    .find('selected')
    .get('vpc_id')
    .value();
    return _.chain(region.subnets)
    .filter(subnet => {
      return subnet.vpc_id === selectedVpc;
    })
    .map(subnet => {
      let subnetName = subnet.subnet_id;
      if (subnet.tags.length){
        subnetName = _.chain(subnet.tags).find({key: 'Name'}).get('value').value() || subnetName;
      }
      const nameString = subnetName !== subnet.subnet_id ? `${subnetName}&nbsp;(${subnet.subnet_id})` : subnet.subnet_id;
      return {
        id: subnet.subnet_id,
        label: `<strong>${subnet.availability_zone}</strong>&nbsp;|&nbsp;${nameString}<br/>
                <span style="color:${seed.color.text2}">${subnet.instance_count} Instances (${subnet.routing})</span>`
      };
    }).value();
  }).flatten().value();
}

export default handleActions({
  [ONBOARD_SET_REGION]: {
    next(state, action){
      return _.assign({}, state, action.payload);
    }
  },
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
  [ONBOARD_VPC_SCAN]: {
    next(state, action){
      const regionsWithVpcs = action.payload;

      const vpcsForSelection = _.chain(regionsWithVpcs).map(region => {
        return _.chain(region.vpcs).map(vpc => {
          let vpcName = vpc.vpc_id;
          if (vpc.tags.length){
            vpcName = _.chain(vpc.tags).find({key: 'Name'}).get('value').value() || vpcName;
          }
          const identifier = vpcName === vpc.vpc_id ? `<strong>${vpcName}</strong>` : `<strong>${vpcName}</strong> - ${vpc.vpc_id}`;
          return {
            id: vpc.vpc_id,
            label: `${identifier} (${vpc.instance_count || 0} Instances)`
          };
        }).value();
      }).flatten().value();
      return _.assign({}, state, {regionsWithVpcs, vpcsForSelection});
    },
    throw: yeller.reportAction
  },
  [ONBOARD_VPC_SELECT]: {
    next(state, action){
      const selectedVPC = action.payload;
      return _.assign({}, state, {selectedVPC});
    }
  },
  [ONBOARD_SUBNET_SELECT]: {
    next(state, action){
      const selectedSubnet = action.payload;
      return _.assign({}, state, {selectedSubnet});
    }
  },
  [ONBOARD_SET_INSTALL_DATA]: {
    next(state){
      const installData = getFinalInstallData(state);
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
    }
  },
  [ONBOARD_SCAN_REGION]: {
    next(state, action) {
      const vpcsForSelection = _.get(action.payload.data, 'vpcs');
      const subnetsForSelection = _.get(action.payload.data, 'subnets');
      return _.assign({}, state, { vpcsForSelection, subnetsForSelection });
    }
  },
  [ONBOARD_HAS_ROLE]: {
    next(state, action) {
      const hasRole = action.payload.data;
      return _.assign({}, state, {hasRole});
    }
  }
}, initial);