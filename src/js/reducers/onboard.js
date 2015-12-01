import storage from '../modules/storage';
import {Record} from 'immutable';
import _ from 'lodash';
import {handleActions} from 'redux-actions';
import moment from 'moment';
import config from '../modules/config';

const initial = {
  'access-key': config['access-key'] || undefined,
  'secret-key': config['secret-key'] || undefined,
  region: config.region || undefined,
  regionsWithVpcs: [],
  vpcsForSelection: [],
  bastionLaunching: undefined,
  installData: undefined
}

function mapRegionsForInstall(region){
  'use strict';
  let obj = _.pick(region, ['region', 'vpcs']);
  obj.vpcs = obj.vpcs.map(vpc => {
    const subnet_id = _.chain(vpc.subnets)
    .sortByAll([
      (t) => t.state === 'available', 
      'default-for-az', 
      'available-ip-address-count'
      ])
    .last().get('subnet-id').value();
    return {
      id: vpc['vpc-id'],
      subnet_id
    }
  });
  return obj;
}

function getFinalInstallData(state){
  'use strict';
  const initial = {
    'instance-size': 't2.micro'
  }
  const regions = _.chain(state.regionsWithVpcs).filter(region => {
    return _.find(region.vpcs, v => v.selected);
  }).map(mapRegionsForInstall).value();
  return _.assign({}, initial, _.pick(state, ['access-key', 'secret-key']), {regions});
}

export default handleActions({
  ONBOARD_SET_REGION: {
    next(state, action){
      return _.assign({}, state, action.payload);
    }
  },
  ONBOARD_SET_CREDENTIALS: {
    next(state, action){
      return _.assign({}, state, action.payload);
    }
  },
  ONBOARD_VPC_SCAN: {
    next(state, action){
      const regionsWithVpcs = action.payload;

      let vpcsForSelection = _.chain(regionsWithVpcs).map(r => {
        return r.vpcs.map(v => {
          let name = v['vpc-id'];
          if (v.tags){
            let nameTag = _.findWhere(v.tags, {key: 'Name'});
            if (nameTag){
              name = `${nameTag.value}`;
            }
          }
          return [v['vpc-id'], `${name} (${v.count} Instances)`];
        });
      }).flatten().value();

      return _.assign({}, state, {regionsWithVpcs, vpcsForSelection});
    }
  },
  ONBOARD_VPC_SELECT: {
    next(state, action){
      const regions = _.cloneDeep(state.regionsWithVpcs);
      const regionsWithVpcs = regions.map(parent => {
        const children = parent.vpcs.map(child => {
          return _.assign({}, child, {selected: child['vpc-id'] === action.payload});
        })
        return _.assign({}, parent, {vpcs: children});
      });
      return _.assign({}, state, {regionsWithVpcs});
    }
  },
  ONBOARD_SET_INSTALL_DATA: {
    next(state, action){
      const installData = getFinalInstallData(state);
      return _.assign({}, state, {installData});      
    }
  },
  ONBOARD_GET_BASTION_LAUNCH_STATUS: {
    next(state, action){
      return _.assign({}, state, {bastionLaunching: action.payload});
    }
  }
}, initial);