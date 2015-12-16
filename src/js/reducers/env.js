import _ from 'lodash';
import Immutable, {List} from 'immutable';
import result from '../modules/result';
// import exampleGroupsElb from '../examples/groupsElb';
import {handleActions} from 'redux-actions';
import {InstanceEcc, InstanceRds, GroupSecurity, GroupElb} from '../modules/schemas';
import {
  ENV_SET_SEARCH,
  ENV_GET_BASTIONS,
  GET_GROUP_SECURITY,
  GET_GROUPS_SECURITY,
  GET_GROUP_ELB,
  GET_GROUPS_ELB,
  GET_INSTANCE_ECC,
  GET_INSTANCES_ECC
} from '../actions/constants';

/* eslint-disable no-use-before-define */

const statics = {
  // getGroupSecurityPending(state, data){
  //   if (_data.groupSecurity.get('id') !== data){
  //     _data.groupSecurity = new GroupSecurity();
  //   }
  // },
  getGroupSecuritySuccess(state, data){
    const arr = state.groups.security;
    const single = statics.groupSecurityFromJS(state, data);
    const index = arr.findIndex(item => {
      return item.get('id') === single.get('id');
    });
    if (index > -1){
      return arr.update(index, () => single);
    }
    return arr.concat(new List([single]));
  },
  getGroupsSecuritySuccess(state, data){
    let newData = _.chain(data).map(d => {
      d.group.type = 'security';
      return d;
    }).sortBy(d => {
      return d.group.GroupName.toLowerCase();
    }).value();
    const changed = newData && newData.length ? Immutable.fromJS(newData.map(g => {
      return statics.groupSecurityFromJS(state, g);
    })) : new List();
    return changed;
  },
  getGroupElbSuccess(state, data){
    const arr = state.groups.elb;
    const single = statics.groupElbFromJS(state, data);
    const index = arr.findIndex(item => {
      return item.get('id') === single.get('id');
    });
    if (index > -1){
      return arr.update(index, () => single);
    }
    return arr.concat(new List([single]));
  },
  getGroupsElbSuccess(state, data){
    let newData = _.chain(data)
    .sortBy(d => {
      return d.group.LoadBalancerName.toLowerCase();
    }).value();
    const changed = newData && newData.length ? Immutable.fromJS(newData.map(g => {
      return statics.groupElbFromJS(state, g);
    })) : new List();
    return changed;
  },
  groupElbFromJS(state, data){
    let newData = data.group || data;
    // let instances = data.instances || data.Instances || newData.instances || newData.Instances;
    newData.instance_count = data.instance_count;
    // if (!instances){
    //   instances = state.instances.ecc.toJS().filter(instance => {
    //     return _.findWhere(instance.SecurityGroups, {GroupId: newData.LoadBalancerName});
    //   });
    // }
    // if (instances.size){
    //   instances = instances.toJS();
    // }
    // if (instances.length){
    //   newData.instances = new List(instances.map(instance => {
    //     const results = instance.results;
    //     return statics.instanceEccFromJS({instance, results});
    //   }));
    // }
    newData.name = newData.LoadBalancerName;
    newData.id = newData.LoadBalancerName;
    _.assign(newData, result.getFormattedData(data));
    newData.checks = new List(newData.checks);
    // newData.checks = CheckStore.getChecks().filter(check => {
    //   return check.target.id === newData.id;
    // });
    if (newData.checks.size && !newData.results.size){
      newData.state = 'initializing';
    }
    return new GroupElb(newData);
  },
  groupSecurityFromJS(state, data){
    let instances = data.instances;
    let newData = data.group || data;
    newData.instance_count = data.instance_count;
    if (!instances){
      instances = state.instances.ecc.toJS().filter(instance => {
        return _.findWhere(instance.SecurityGroups, {GroupId: newData.LoadBalancerName});
      });
    }
    if (instances.size){
      instances = instances.toJS();
    }
    if (instances.length){
      newData.instances = new List(instances.map(instance => {
        const results = instance.results;
        return statics.instanceEccFromJS({instance, results});
      }));
    }
    //TODO - make sure status starts working when coming from api, have to code it like meta below
    newData.meta = Immutable.fromJS(newData.meta);
    newData.id = newData.GroupId;
    newData.name = newData.GroupName;
    _.assign(newData, result.getFormattedData(data));
    newData.checks = new List(newData.checks);
    if (newData.checks.size && !newData.results.size){
      newData.state = 'initializing';
    }
    return new GroupSecurity(newData);
  },
  // populateGroupInstances(state){
  //   let groupsSecurity = _data.groupsSecurity;
  //   _data.groupsSecurity = groupsSecurity.map(sg => {
  //     const instances = state.instances.ecc.filter(instance => {
  //       return _.findWhere(instance.SecurityGroups, {GroupId: sg.id});
  //     });
  //     const newSg = sg.set('instances', new List(instances));
  //     return newSg;
  //   });
  // },
  // getInstancePending(state, data){
  //   if (_data.instance.get('id') !== data){
  //     _data.instance = new Instance();
  //     Store.emitChange();
  //   }
  // },
  getInstanceEccSuccess(state, data){
    const arr = state.instances.ecc;
    const single = statics.instanceEccFromJS(data);
    const index = arr.findIndex(item => {
      return item.get('id') === single.get('id');
    });
    if (index > -1){
      return arr.update(index, () => single);
    }
    return arr.concat(new List([single]));

    // if (data && data.instance){
    //   let newInstance = data.instance;
    //   newInstance.type = 'EC2';
    //   return statics.instanceEccFromJS({instance: newInstance, results: data.results});
    // }
  },
  getInstancesEccSuccess(state, data){
    let newData = _.chain(data)
    .map(statics.instanceEccFromJS)
    .sortBy(i => {
      return i.name.toLowerCase();
    }).value();
    return newData && newData.length ? Immutable.fromJS(newData) : List();
  },
  getInstanceRdsSuccess(state, data){
    if (data && data.instances){
      let newData = data.instances;
      newData.type = 'RDS';
      newData.groups = newData.SecurityGroups;
      return statics.instanceRdsFromJS(newData);
    }
  },
  getInstancesRdsSuccess(state, data){
    let newData = _.chain(data)
    .uniq('InstanceId')
    .map(statics.instanceRdsFromJS)
    .sortBy(i => {
      return i.name.toLowerCase();
    }).value();
    return newData && newData.length ? Immutable.fromJS(newData) : List();
  },
  getCreatedTime(time){
    let launchTime;
    const parsed = Date.parse(time);
    if (typeof parsed === 'number' && !_.isNaN(parsed) && parsed > 0){
      launchTime = parsed;
    }
    return launchTime;
  },
  instanceRdsFromJS(data){
    let newData = data.instance || data;
    newData.id = newData.DbiResourceId;
    newData.name = newData.DBName;
    newData.LaunchTime = statics.getCreatedTime(newData.InstanceCreateTime);
    return new InstanceRds(newData);
  },
  instanceEccFromJS(raw){
    let data = raw.instance;
    let newData = data.instance ? _.cloneDeep(data.instance) : _.cloneDeep(data);
    if (newData.DBInstanceIdentifier){
      return statics.instanceRdsFromJS(newData);
    }
    if (!newData.results){
      newData.results = raw.results || data.results;
    }
    newData.id = newData.InstanceId;
    let name = newData.id;
    if (newData.Tags && newData.Tags.length){
      name = _.chain(newData.Tags).findWhere({Key: 'Name'}).get('Value').value() || name;
    }
    newData.name = name;
    newData.LaunchTime = statics.getCreatedTime(newData.LaunchTime);
    newData.type = 'EC2';
    _.assign(newData, result.getFormattedData(newData));
    if (newData.checks && newData.checks.size && !newData.results.size){
      newData.state = 'initializing';
    }
    // TODO Possibly re-enable this
    // if (newData.SecurityGroups && newData.SecurityGroups.length){
    //   newData.groups = new List(newData.SecurityGroups.map(group => statics.groupSecurityFromJS(group)));
    // }
    //TODO - make sure status starts working when coming from api, have to code it like meta below
    newData.meta = Immutable.fromJS(newData.meta);
    return new InstanceEcc(newData);
  }
  // runInstanceAction(state, data){
  //   _data.instancesEcc = _data.instancesEcc.map(instance => {
  //     if (instance.get('id') === data.id){
  //       let changed = instance.toJS();
  //       changed.state = 'restarting';
  //       return Immutable.fromJS(changed);
  //     }
  //     return instance;
  //   });
  // }
};

const initial = {
  groups: {
    security: new List(),
    rds: new List(),
    elb: new List()
  },
  instances: {
    ecc: new List(),
    rds: new List()
  },
  search: null,
  bastions: []
};

export default handleActions({
  // FILTER_ENV: {
  //   next(state, action){
  //     const type = action.payload.type;
  //     const items = _.get(state, type);
  //     const strings = action.payload.type.split('.');
  //     if (!items){
  //       return state;
  //     }
  //     let data;
  //     if (action.payload.id){
  //     }
  //     const security = statics.getGroupSecuritySuccess(state, action.payload);
  //     const data = _.assign({}, state.groups, {security});
  //     return _.assign({}, state, {groups: data});
  //   }
  // },
  [ENV_SET_SEARCH]: {
    next(state, action){
      return _.assign({}, state, {search: action.payload});
    }
  },
  [GET_GROUP_SECURITY]: {
    next(state, action){
      const security = statics.getGroupSecuritySuccess(state, action.payload);
      const data = _.assign({}, state.groups, {security});
      return _.assign({}, state, {groups: data});
    }
  },
  [GET_GROUPS_SECURITY]: {
    next(state, action){
      const security = statics.getGroupsSecuritySuccess(state, action.payload);
      const data = _.assign({}, state.groups, {security});
      return _.assign({}, state, {groups: data});
    }
  },
  [GET_GROUP_ELB]: {
    next(state, action){
      const elb = statics.getGroupElbSuccess(state, action.payload);
      const data = _.assign({}, state.groups, {elb});
      return _.assign({}, state, {groups: data});
    }
  },
  [GET_GROUPS_ELB]: {
    next(state, action){
      const elb = statics.getGroupsElbSuccess(state, action.payload);
      const data = _.assign({}, state.groups, {elb});
      return _.assign({}, state, {groups: data});
    }
  },
  [GET_INSTANCE_ECC]: {
    next(state, action){
      const ecc = statics.getInstanceEccSuccess(state, action.payload);
      const data = _.assign({}, state.instances, {ecc});
      return _.assign({}, state, {instances: data});
    }
  },
  [GET_INSTANCES_ECC]: {
    next(state, action){
      const ecc = statics.getInstancesEccSuccess(state, action.payload);
      const data = _.assign({}, state.instances, {ecc});
      return _.assign({}, state, {instances: data});
    }
  },
  [ENV_GET_BASTIONS]: {
    next(state, action){
      return _.assign({}, state, {bastions: action.payload});
    }
  }
}, initial);