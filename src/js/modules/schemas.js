import _ from 'lodash';
import {Record, List, Map} from 'immutable';
import config from './config';

export const User = Record({
  name: null,
  email: null,
  id: null,
  token: null,
  loginDate: null,
  admin: false,
  admin_id: 0,
  intercom_hmac: null,
  auth: null,
  ghosting: false,
  customer_id: undefined,
  data: undefined
});

const baseEnvItem = {
  id: null,
  name: null,
  lastChecked: null,
  silenceDate: null,
  silenceDuration: null,
  state: 'running',
  health: undefined,
  type: null,
  checks: List(),
  results: List(),
  passing: 0,
  total: 0
};

export const InstanceEcc = Record(_.assign({}, baseEnvItem, {
  meta: new Map({
    created: new Date(),
    instanceSize: 't2-micro'
  }),
  type: 'EC2',
  // groups: List(),
  LaunchTime: null,
  InstanceType: null,
  Placement: new Map({
    AvailabilityZone: undefined,
    GroupName: undefined,
    Tenancy: undefined
  }),
  SecurityGroups: List()
}));

export const InstanceRds = Record(_.assign({}, baseEnvItem, {
  meta: new Map({
    created: new Date(),
    instanceSize: 't2-micro'
  }),
  type: 'RDS',
  groups: List(),
  LaunchTime: null,
  Engine: null,
  EngineVersion: null,
  PubliclyAccessible: false,
  DBInstanceClass: null,
  AvailabilityZone: null,
  VpcSecurityGroups: List()
}));

export const GroupSecurity = Record(_.assign({}, baseEnvItem, {
  type: 'security',
  Description: undefined,
  instance_count: undefined,
  instances: List()
}));

export const GroupElb = Record(_.assign({}, baseEnvItem, {
  type: 'elb',
  Description: undefined,
  CreatedTime: undefined,
  instance_count: undefined,
  instances: new List()
}));

const Target = Record({
  name: undefined,
  type: 'sg',
  id: undefined
});

export const Check = Record({
  id: undefined,
  name: undefined,
  target: Target(),
  // assertions: List([
  //   {
  //     key: 'code',
  //     operand: 200,
  //     relationship: 'equal'
  //   }
  // ]),
  assertions: [],
  notifications: List(),
  instances: List(),
  health: undefined,
  state: 'initializing',
  silenceDate: undefined,
  silenceDuration: undefined,
  interval: 30,
  results: List(),
  passing: undefined,
  total: undefined,
  check_spec: Map({
    type_url: 'HttpCheck',
    value: Map({
      name: undefined,
      path: config.checkDefaultPath,
      protocol: config.checkDefaultProtocol,
      port: config.checkDefaultPort,
      verb: undefined,
      body: undefined,
      headers: new List()
    })
  })
});