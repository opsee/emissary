import _ from 'lodash';
import {fromJS, List} from 'immutable';
import {itemsFilter, yeller} from '../modules';
// import exampleGroupsElb from '../examples/groupsElb';
import {handleActions} from 'redux-actions';
import {
  InstanceEcc,
  InstanceRds,
  GroupSecurity,
  GroupElb,
  GroupAsg
} from '../modules/schemas';
import {
  ENV_GET_BASTIONS,
  ENV_GET_ALL,
  GET_GROUP_SECURITY,
  GET_GROUPS_SECURITY,
  GET_GROUP_ASG,
  GET_GROUPS_ASG,
  GET_GROUP_ELB,
  GET_GROUPS_ELB,
  GET_INSTANCE_ECC,
  GET_INSTANCES_ECC,
  GET_INSTANCE_RDS,
  GET_INSTANCES_RDS,
  GET_METRIC_RDS,
  ENV_SET_FILTERED,
  AWS_REBOOT_INSTANCES,
  AWS_START_INSTANCES,
  AWS_STOP_INSTANCES,
  GET_CHECKS,
  APP_SOCKET_MSG
} from '../actions/constants';

/* eslint-disable no-use-before-define */

const statics = {
  updateArray(arr, single){
    const index = arr.findIndex(item => {
      return item.get('id') === single.get('id');
    });
    if (index > -1){
      return arr.update(index, () => single);
    }
    return arr.concat(new List([single]));
  },
  setResultMeta(item, checks, toMatch = []){
    const foundChecks = _.filter(checks, r => {
      return item.get('id') === r.target.id;
      // return toMatch.indexOf(r.target.id) > -1;
    });

    const results = _.chain(checks)
    .map(check => {
      return _.get(check, 'results[0].responses') || [];
    })
    .flatten()
    .value();

    let foundResults = _.filter(results, r => {
      return toMatch.indexOf(r.target.id) > -1;
    });

    //this seems wacky but,
    //we use checks instead of results for determining health for such things
    if (item.type.match('elb|security|asg')){
      foundResults = foundChecks.map(check => {
        return _.assign(check, {
          passing: _.get(check, 'results[0].passing') || false
        });
      });
      //only use checks that have results for counting
      //otherwise we want to show initializing
      foundResults = _.filter(foundResults, check => {
        return (_.get(check, 'results[0].responses') || []).length;
      });
    }

    const total = foundResults.length;
    const passing =  _.filter(foundResults, (r) => r.passing).length;

    let data = item.set('results', foundResults);
    data = data.set('total', total);
    data = data.set('passing', passing);
    data = data.set('failing', total - passing);
    data = data.set('checks', foundChecks);
    const health = total ? Math.floor((passing / total) * 100) : undefined;
    data = data.set('health', health);
    let state = total ? ((passing && 'passing') || 'failing') : 'running';
    if (state === 'running' && foundChecks.length){
      state = 'initializing';
    }
    data = data.set('state', state);
    return data;
  },
  getGroupSecuritySuccess(state, data = []){
    const arr = state.groups.security;
    const single = statics.groupSecurityFromJS(state, _.head(data));
    return statics.updateArray(arr, single);
  },
  getGroupsSecuritySuccess(state, data = []){
    let newData = _.chain(data).sortBy(d => {
      return (_.get(d, 'GroupName') || '').toLowerCase();
    }).value();
    const security = fromJS(newData.map(g => {
      return statics.groupSecurityFromJS(state, g);
    })) || new List();
    let newState = _.assign({}, state, {groups: _.assign({}, state.groups, {security})});
    return statics.getGroupSecurityResults(newState, state.checks);
  },
  getGroupSecurityResults(state, checks = state.checks){
    return state.groups.security.map(group => {
      let toMatch = [group.id];
      // toMatch = toMatch.concat(_.map(group.Instances, 'InstanceId'));
      return statics.setResultMeta(group, checks, toMatch);
    });
  },
  getGroupsSecurityInstances(action){
    let {groups, instances} = action.payload.data;
    return groups.map(g => {
      const Instances = _.chain(instances)
      .filter(instance => {
        const gIds = _.map(instance.SecurityGroups, 'GroupId');
        return gIds.indexOf(g.GroupId) > -1;
      })
      .map(i => _.pick(i, ['InstanceId']))
      .value();
      return _.assign(g, {Instances});
    });
  },
  getGroupAsgSuccess(state, data = []){
    const arr = state.groups.asg;
    const single = statics.groupAsgFromJS(state, _.head(data));
    return statics.updateArray(arr, single);
  },
  getGroupsAsgSuccess(state, data = []){
    let newData = _.chain(data).sortBy(d => {
      return (_.get(d, 'GroupName') || '').toLowerCase();
    }).value();

    const asg = fromJS(newData.map(g => {
      return statics.groupAsgFromJS(state, g);
    })) || new List();
    let newState = _.assign({}, state, {groups: _.assign({}, state.groups, {asg})});
    return statics.getGroupAsgResults(newState, state.checks);
  },
  getGroupAsgResults(state, checks = state.checks){
    return state.groups.asg.map(group => {
      let toMatch = [group.id];
      // toMatch = toMatch.concat(_.map(group.Instances, 'InstanceId'));
      return statics.setResultMeta(group, checks, toMatch);
    });
  },
  getGroupElbSuccess(state, data = []){
    const arr = state.groups.elb;
    const single = statics.groupElbFromJS(state, _.head(data));
    return statics.updateArray(arr, single);
  },
  getGroupsElbSuccess(state, data = []){
    let newData = _.chain(data)
    .sortBy(d => {
      return d.LoadBalancerName.toLowerCase();
    }).value();

    const elb = fromJS(newData.map(g => {
      return statics.groupElbFromJS(state, g);
    })) || new List();
    let newState = _.assign({}, state, {groups: _.assign({}, state.groups, {elb})});
    return statics.getGroupElbResults(newState, state.checks);
  },
  getGroupElbResults(state, checks = state.checks){
    return state.groups.elb.map(group => {
      let toMatch = [group.id];
      // toMatch = toMatch.concat(_.map(group.Instances, 'InstanceId'));
      return statics.setResultMeta(group, checks, toMatch);
    });
  },
  groupElbFromJS(state, data = {}){
    let newData = _.assign({}, data);
    newData = _.assign(newData, {
      name: newData.LoadBalancerName,
      checks: new List(newData.checks || []),
      id: newData.LoadBalancerName
    });
    if (newData.checks.size && !newData.results.size){
      newData.state = 'initializing';
    }
    return new GroupElb(newData);
  },
  groupSecurityFromJS(state, data = {}){
    let newData = _.cloneDeep(data);
    newData = _.assign(newData, {
      id: newData.GroupId,
      name: newData.GroupName,
      checks: new List(newData.checks || [])
    });
    return new GroupSecurity(newData);
  },
  groupAsgFromJS(state, data = {}){
    let newData = _.cloneDeep(data);
    newData = _.assign(newData, {
      id: newData.AutoScalingGroupName,
      name: _.chain(newData.Tags).find({Key: 'Name'}).get('Value').value() || newData.AutoScalingGroupName
    });
    return new GroupAsg(newData);
  },
  getInstanceEccSuccess(state, data = []){
    const arr = state.instances.ecc;
    const single = statics.instanceEccFromJS(state, _.head(data));
    return statics.updateArray(arr, single);
  },
  getInstancesEccSuccess(state, data = []){
    let newData = _.chain(data)
    .map(d => statics.instanceEccFromJS(state, d))
    .sortBy(i => {
      return i.name.toLowerCase();
    }).value();

    const ecc = fromJS(newData);
    let newState = _.assign({}, state, {instances: _.assign({}, state.instances, {ecc})});
    return statics.getInstanceEccResults(newState, state.checks);
  },
  getInstanceEccResults(state, checks = state.checks){
    return state.instances.ecc.map(instance => {
      let toMatch = [instance.id];
      return statics.setResultMeta(instance, checks, toMatch);
    });
  },
  getInstanceRdsSuccess(state, data = []){
    const arr = state.instances.rds;
    let instance = _.head(data);
    const single = statics.instanceRdsFromJS(state, instance);
    return statics.updateArray(arr, single);
  },
  getInstancesRdsSuccess(state, data){
    let newData = _.chain(data)
    .map(d => statics.instanceRdsFromJS(state, d))
    .sortBy(i => {
      return i.name.toLowerCase();
    }).value();

    const rds = fromJS(newData);
    let newState = _.assign({}, state, {instances: _.assign({}, state.instances, {rds})});
    return statics.getInstanceRdsResults(newState, state.checks);
  },
  getInstanceRdsResults(state, checks = state.checks){
    return state.instances.rds.map(instance => {
      let toMatch = [instance.id];
      return statics.setResultMeta(instance, checks, toMatch);
    });
  },
  getMetricsSuccess(state, instances){
    const arr = state.instances.rds;
    const data = instances[0];
    const old = arr.find(item => {
      return item.get('id') === data.DBInstanceIdentifier;
    }) || new InstanceRds();
    const oldJS = old.toJS();
    let metrics = _.assign((oldJS.metrics || {}), data.metrics);
    const obj = _.assign(old.toJS(), data, {metrics});
    return statics.getInstancesRdsSuccess(state, [obj]);
  },
  getCreatedTime(time){
    let parsed;
    if (typeof time === 'number'){
      parsed = new Date(time);
    } else {
      parsed = Date.parse(time);
    }
    return !_.isNaN(parsed) ? parsed : undefined;
  },
  instanceRdsFromJS(state, raw){
    let data = _.cloneDeep(raw);
    data.id = data.name = data.DBInstanceIdentifier;
    if (data.DBName !== data.id){
      data.name = `${data.DBName} - ${data.id}`;
    }
    data.InstanceCreateTime = new Date(data.InstanceCreateTime);
    if (data.VpcSecurityGroups){
      data.VpcSecurityGroups = new List(data.VpcSecurityGroups.map(g => fromJS(g)));
    }
    data.meta = fromJS(data.meta);

    //let's keep the metrics we grabbed from other places
    const arr = state.instances.rds;
    let old = arr.find(i => {
      return i.get('id') === data.id;
    });
    old = old ? old.toJS() : null;
    let metrics = {};
    if (old && old.metrics && _.keys(old.metrics).length){
      metrics = _.assign(old.metrics, data.metrics || {});
    }
    data = _.assign(data, {metrics});

    return new InstanceRds(data);
  },
  instanceEccFromJS(state, data){
    let newData = _.cloneDeep(data);
    const tagName = _.chain(newData.Tags).find({Key: 'Name'}).get('Value').value();
    newData = _.assign(newData, {
      id: newData.InstanceId,
      name: tagName || newData.InstanceId,
      LaunchTime: statics.getCreatedTime(newData.LaunchTime),
      SecurityGroups: Array.isArray(newData.SecurityGroups) ? new List(newData.SecurityGroups.map(g => fromJS(g))) : new List(),
      state: (newData.checks && newData.checks.size && !newData.results.size) ? 'initializing' : 'running'
    });
    return new InstanceEcc(newData);
  },
  getNewFiltered(data = new List(), state, action = {payload: {search: ''}}, type = ''){
    const arr = type.split('.');
    const filteredData = itemsFilter(data, action.payload.search, type);
    //this looks nasty but all we are doing is creating a new filtered obj with fresh data
    return _.assign({}, state.filtered, {[arr[0]]: _.assign({}, state.filtered[arr[0]], {[arr[1]]: filteredData})});
  }
};

const initial = {
  groups: {
    security: new List(),
    rds: new List(),
    elb: new List(),
    asg: new List()
  },
  instances: {
    ecc: new List(),
    rds: new List()
  },
  filtered: {
    groups: {
      security: new List(),
      rds: new List(),
      elb: new List(),
      asg: new List()
    },
    instances: {
      ecc: new List(),
      rds: new List()
    }
  },
  activeBastion: null,
  bastions: [],
  awsActionHistory: [],
  region: undefined,
  vpc: undefined,
  checks: []
};

export default handleActions({
  [ENV_GET_ALL]: {
    next(state, action){
      const security = statics.getGroupSecuritySuccess(state, action.payload.data);
      const filtered = statics.getNewFiltered(security, state, action, 'groups.security');
      const groups = _.assign({}, state.groups, {security});
      return _.assign({}, state, {groups, filtered});
    },
    throw: yeller.reportAction
  },
  [GET_GROUP_SECURITY]: {
    next(state, action){
      let groups = statics.getGroupsSecurityInstances(action);
      const security = statics.getGroupSecuritySuccess(state, groups);
      const filtered = statics.getNewFiltered(security, state, action, 'groups.security');
      groups = _.assign({}, state.groups, {security});
      return _.assign({}, state, {groups, filtered});
    },
    throw: yeller.reportAction
  },
  [GET_GROUPS_SECURITY]: {
    next(state, action){
      let groups = statics.getGroupsSecurityInstances(action);
      const security = statics.getGroupsSecuritySuccess(state, groups);
      const filtered = statics.getNewFiltered(security, state, action, 'groups.security');
      groups = _.assign({}, state.groups, {security});
      return _.assign({}, state, {groups, filtered});
    },
    throw: yeller.reportAction
  },
  [GET_GROUP_ASG]: {
    next(state, action){
      //TODO remove when there is only one in the array (backend err)
      const arr = _.filter(action.payload.data || [], {AutoScalingGroupName: action.payload.id});
      const asg = statics.getGroupAsgSuccess(state, arr);
      const filtered = statics.getNewFiltered(asg, state, action, 'groups.asg');
      const groups = _.assign({}, state.groups, {asg});
      return _.assign({}, state, {groups, filtered});
    },
    throw: yeller.reportAction
  },
  [GET_GROUPS_ASG]: {
    next(state, action){
      const asg = statics.getGroupsAsgSuccess(state, action.payload.data);
      const filtered = statics.getNewFiltered(asg, state, action, 'groups.asg');
      const groups = _.assign({}, state.groups, {asg});
      return _.assign({}, state, {groups, filtered});
    },
    throw: yeller.reportAction
  },
  [GET_GROUP_ELB]: {
    next(state, action){
      const elb = statics.getGroupElbSuccess(state, action.payload.data);
      const filtered = statics.getNewFiltered(elb, state, action, 'groups.elb');
      const groups = _.assign({}, state.groups, {elb});
      return _.assign({}, state, {groups, filtered});
    },
    throw: yeller.reportAction
  },
  [GET_GROUPS_ELB]: {
    next(state, action){
      const elb = statics.getGroupsElbSuccess(state, action.payload.data);
      const filtered = statics.getNewFiltered(elb, state, action, 'groups.elb');
      const groups = _.assign({}, state.groups, {elb});
      return _.assign({}, state, {groups, filtered});
    },
    throw: yeller.reportAction
  },
  [GET_INSTANCE_ECC]: {
    next(state, action){
      const ecc = statics.getInstanceEccSuccess(state, action.payload.data);
      const filtered = statics.getNewFiltered(ecc, state, action, 'instances.ecc');
      const instances = _.assign({}, state.instances, {ecc});
      return _.assign({}, state, {instances, filtered});
    },
    throw: yeller.reportAction
  },
  [GET_INSTANCES_ECC]: {
    next(state, action){
      const ecc = statics.getInstancesEccSuccess(state, action.payload.data);
      const filtered = statics.getNewFiltered(ecc, state, action, 'instances.ecc');
      const instances = _.assign({}, state.instances, {ecc});
      return _.assign({}, state, {instances, filtered});
    },
    throw: yeller.reportAction
  },
  [GET_INSTANCE_RDS]: {
    next(state, action){
      const rds = statics.getInstanceRdsSuccess(state, action.payload.data);
      const filtered = statics.getNewFiltered(rds, state, action, 'instances.rds');
      const instances = _.assign({}, state.instances, {rds});
      return _.assign({}, state, {instances, filtered});
    },
    throw: yeller.reportAction
  },
  [GET_INSTANCES_RDS]: {
    next(state, action){
      const rds = statics.getInstancesRdsSuccess(state, action.payload.data);
      const filtered = statics.getNewFiltered(rds, state, action, 'instances.rds');
      const instances = _.assign({}, state.instances, {rds});
      return _.assign({}, state, {instances, filtered});
    },
    throw: yeller.reportAction
  },
  [GET_METRIC_RDS]: {
    next(state, action) {
      const rds = statics.getMetricsSuccess(state, action.payload.data);
      const filtered = statics.getNewFiltered(rds, state, action, 'instances.rds');
      const instances = _.assign({}, state.instances, {rds});
      return _.assign({}, state, { instances, filtered });
    },
    throw: yeller.reportAction
  },
  [ENV_GET_BASTIONS]: {
    next(state, action){
      const bastions = action.payload;
      const activeBastion = _.chain(bastions || []).filter('connected').last().value() || null;
      const region = _.get(activeBastion, 'region');
      const vpc = _.get(activeBastion, 'vpc_id', false);
      return _.assign({}, state, {
        bastions,
        activeBastion,
        region,
        vpc
      });
    },
    throw: yeller.reportAction
  },
  [ENV_SET_FILTERED]: {
    next(state, action = {payload: {string: '', tokens: []}}){
      const {groups, instances} = state;
      const filtered = {
        groups: {
          security: itemsFilter(groups.security, action.payload, 'groups.security'),
          elb: itemsFilter(groups.elb, action.payload, 'groups.elb'),
          asg: itemsFilter(groups.asg, action.payload, 'groups.asg')
        },
        instances: {
          ecc: itemsFilter(instances.ecc, action.payload, 'instances.ecc'),
          rds: itemsFilter(instances.rds, action.payload, 'instances.rds')
        }
      };
      return _.assign({}, state, {filtered});
    }
  },
  [GET_CHECKS]: {
    next(state, action){
      const checks = action.payload.data;

      const security = statics.getGroupSecurityResults(state, checks);
      const elb = statics.getGroupElbResults(state, checks);
      const asg = statics.getGroupAsgResults(state, checks);

      const ecc = statics.getInstanceEccResults(state, checks);
      const rds = statics.getInstanceRdsResults(state, checks);

      return _.assign({}, state, {checks}, {
        groups: {security, elb, asg},
        instances: {ecc, rds}
      });
    }
  },
  [AWS_START_INSTANCES]: {
    next(state, action){
      const awsActionHistory = state.awsActionHistory.concat([
        {
          action: 'start',
          ids: action.payload.data || [],
          date: new Date()
        }
      ]);
      return _.assign({}, state, {awsActionHistory});
    },
    throw: yeller.reportAction
  },
  [AWS_STOP_INSTANCES]: {
    next(state, action){
      const awsActionHistory = state.awsActionHistory.concat([
        {
          action: 'stop',
          ids: action.payload.data || [],
          date: new Date()
        }
      ]);
      return _.assign({}, state, {awsActionHistory});
    },
    throw: yeller.reportAction
  },
  [AWS_REBOOT_INSTANCES]: {
    next(state, action){
      const awsActionHistory = state.awsActionHistory.concat([
        {
          action: 'reboot',
          ids: action.payload.data || [],
          date: new Date()
        }
      ]);
      return _.assign({}, state, {awsActionHistory});
    },
    throw: yeller.reportAction
  },
  [APP_SOCKET_MSG]: {
    next(state, action){
      if (_.get(action.payload, 'command') === 'bastions'){
        const bastion = _.chain(action.payload)
        .get('attributes.bastions')
        .thru(arr => {
          return Array.isArray(arr) ? arr : [];
        })
        .find(msg => _.get(msg, 'connected'))
        .value() || {};
        if (bastion && bastion.region){
          return _.assign({}, state, {region: bastion.region, vpc: bastion.vpc_id || false});
        }
      }
      return state;
    }
  }
}, initial);