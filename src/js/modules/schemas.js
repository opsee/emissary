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
  created_at: null,
  intercom_hmac: null,
  auth: null,
  ghosting: false,
  customer_id: undefined,
  data: undefined,
  loginData: {},
  region: undefined,
  vpc: undefined,
  verified: null
});

export const Member = Record({
  name: undefined,
  capabilities: new List(),
  email: undefined,
  status: undefined,
  id: undefined
});

export const Team = Record({
  name: undefined,
  features: new List(),
  plan: undefined,
  members: new List(),
  invoices: new List()
});

const baseEnvItem = {
  id: null,
  name: null,
  lastChecked: null,
  silenceDate: null,
  silenceDuration: null,
  state: 'running',
  type: null,
  checks: List(),
  results: List(),
  passing: 0,
  failing: 0,
  total: 0,
  selected: false,
  health: undefined
};

export const InstanceEcc = Record(_.assign({}, baseEnvItem, {
  meta: new Map({
    created: new Date(),
    instanceSize: 't2-micro'
  }),
  type: 'ecc',
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
  type: 'rds',
  groups: List(),
  InstanceCreateTime: null,
  Engine: null,
  EngineVersion: null,
  PubliclyAccessible: false,
  DBInstanceClass: null,
  AvailabilityZone: null,
  VpcSecurityGroups: List(),
  metrics: Map()
}));

export const GroupSecurity = Record(_.assign({}, baseEnvItem, {
  type: 'security',
  Description: undefined,
  Instances: List()
}));

export const GroupAsg = Record(_.assign({}, baseEnvItem, {
  type: 'asg',
  Instances: List(),
  Status: undefined,
  CreatedTime: undefined,
  MinSize: undefined,
  MaxSize: undefined,
  DesiredCapacity: undefined,
  AvailabilityZones: undefined,
  SuspendedProcesses: List()
}));

export const GroupElb = Record(_.assign({}, baseEnvItem, {
  type: 'elb',
  Description: undefined,
  CreatedTime: undefined,
  Instances: new List(),
  ListenerDescriptions: List()
}));

const Target = Record({
  name: undefined,
  type: undefined,
  id: undefined
});

export const Check = Record({
  tags: List(),
  selected: false,
  deleting: false,
  id: undefined,
  name: undefined,
  target: Target({
    name: config.checkDefaultTargetName,
    type: config.checkDefaultTargetType,
    id: config.checkDefaultTargetId
  }),
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
  spec: Map({
    path: config.checkDefaultPath || '/',
    protocol: config.checkDefaultProtocol || 'http',
    port: config.checkDefaultPort || 80,
    verb: config.checkDefaultVerb || 'GET',
    body: undefined,
    headers: new List(),
    metrics: new List()
  })
});

export const CheckEvent = Record({
  check_name: undefined,
  check_id: undefined,
  timestamp: undefined,
  passing: undefined,
  responses: new List(),
  target: undefined,
  version: undefined
});