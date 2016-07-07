import flag from './flag';
import _ from 'lodash';

export default function(redux){
  let types = [{
    id: 'external_host',
    title: 'Global URL',
    types: ['http'],
    size: () => ''
  }];
  if (!!redux.env.activeBastion) {
    types = _.concat(types,
      [
        {
          id: 'host',
          title: 'Internal URL',
          types: ['http'],
          size: () => ''
        },
        {
          id: 'elb',
          title: 'ELB',
          types: ['http', 'cloudwatch'],
          size: () => redux.env.groups.elb.size
        },
        {
          id: 'security',
          title: 'Security Group',
          types: ['http'],
          size: () => redux.env.groups.security.size
        },
        {
          id: 'ecs',
          title: 'EC2 Container Services',
          types: ['cloudwatch'],
          size: () => redux.env.groups.ecs.size
        },
        {
          id: 'asg',
          title: 'Auto Scaling Group',
          types: ['http'],
          size: () => redux.env.groups.asg.size
        },
        {
          id: 'ecc',
          title: 'EC2 Instance',
          types: ['http', 'cloudwatch'],
          size: () => redux.env.instances.ecc.size
        },
        {
          id: 'rds',
          title: 'RDS Instance',
          types: ['cloudwatch'],
          size: () => redux.env.instances.rds.size
        }
      ]
    );
  }
  return _.chain(types).filter(type => {
    return flag(`check-type-${type.id}`);
  })
  .filter(type => {
    return type.size() > 0 || type.id === 'host' || type.id === 'external_host';
  })
  .value();
}