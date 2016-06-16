import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';

import {SetInterval} from '../../modules/mixins';
import {GroupItemList} from '../groups';
import {CheckItemList} from '../checks';
import {InstanceItemList} from '../instances';
import {FilterButtons} from '../search';
import {Padding} from '../layout';

const EnvList = React.createClass({
  mixins: [SetInterval],
  propTypes: {
    include: PropTypes.arrayOf(PropTypes.oneOf([
      'groups.security',
      'groups.elb',
      'groups.asg',
      'instances.ecc',
      'instances.rds',
      'checks'
    ])),
    filter: PropTypes.bool,
    onFilterChange: PropTypes.func,
    onTargetSelect: PropTypes.func,
    noModal: PropTypes.bool,
    limit: PropTypes.number,
    showFilterButtons: PropTypes.bool,
    //disable fetch data on component mount?
    noFetch: PropTypes.bool,
    redux: PropTypes.shape({
      asyncActions: PropTypes.object,
      search: PropTypes.shape({
        string: PropTypes.string
      }),
      checks: PropTypes.shape({
        checks: PropTypes.object,
        filtered: PropTypes.object
      }),
      env: PropTypes.shape({
        groups: PropTypes.shape({
          security: PropTypes.object,
          elb: PropTypes.object
        }),
        instances: PropTypes.shape({
          ecc: PropTypes.object,
          rds: PropTypes.object
        }),
        filtered: PropTypes.shape({
          groups: PropTypes.shape({
            security: PropTypes.object,
            elb: PropTypes.object
          }),
          instances: PropTypes.shape({
            ecc: PropTypes.object,
            rds: PropTypes.object
          })
        }),
        activeBastion: PropTypes.object,
        bastions: PropTypes.array,
        search: PropTypes.string
      })
    })
  },
  getDefaultProps(){
    return {
      include: ['groups.elb', 'groups.security', 'groups.asg', 'instances.rds', 'instances.ecc', 'checks'],
      limit: 1000
    };
  },
  getIncludes(){
    const hasBastion = !!this.props.redux.env.activeBastion;
    let {include, redux} = this.props;
    return _.chain(include)
    .filter(i => {
      return hasBastion || i === 'checks';
    }).sortBy(include, i => {
      let size = _.get(redux.env, `${this.props.filter && 'filtered.' || ''}${i}.size`);
      if (i === 'checks'){
        const string = this.props.filter ? 'filtered' : 'checks';
        size = _.get(redux.checks, `${string}.size`);
      }
      //let's do some secondary sorting
      if (size && !this.props.filter){
        if (i === 'groups.elb'){
          size = 5000;
        } else if (i === 'groups.asg'){
          size = 4000;
        } else if (i === 'groups.security'){
          size = 3000;
        }
      }
      return (-1 * size) || 0;
    }).value();
  },
  renderGroupsSecurity(){
    return (
      <Padding b={3} key="env-list-groups-security">
        <GroupItemList filter={this.props.filter} type="security" onClick={this.props.onTargetSelect} noModal={this.props.noModal} limit={this.props.limit} title="Security Groups" noFetch={this.props.noFetch}/>
      </Padding>
    );
  },
  renderGroupsAsg(){
    return (
      <Padding b={3} key="env-list-groups-asg">
        <GroupItemList filter={this.props.filter} type="asg" onClick={this.props.onTargetSelect} noModal={this.props.noModal} limit={this.props.limit} title="Autoscaling Groups" noFetch={this.props.noFetch}/>
      </Padding>
    );
  },
  renderGroupsElb(){
    return (
      <Padding b={3} key="env-list-groups-elb">
        <GroupItemList type="elb" filter={this.props.filter} onClick={this.props.onTargetSelect} noModal={this.props.noModal} limit={this.props.limit} title="ELBs" noFetch={this.props.noFetch}/>
      </Padding>
    );
  },
  renderInstancesEcc(){
    return (
      <Padding b={3} key="env-list-instances-ecc">
        <InstanceItemList filter={this.props.filter} onClick={this.props.onTargetSelect} noModal={this.props.noModal} limit={this.props.limit} type="ecc" title noFetch={this.props.noFetch}/>
      </Padding>
    );
  },
  renderInstancesRds(){
    return (
      <Padding b={3} key="env-list-instances-rds">
        <InstanceItemList filter={this.props.filter} onClick={this.props.onTargetSelect} noModal={this.props.noModal} limit={this.props.limit} type="rds" title noFetch={this.props.noFetch}/>
      </Padding>
    );
  },
  renderChecks(){
    return (
      <Padding b={3} key="env-list-checks">
        <CheckItemList filter={this.props.filter} onClick={this.props.onTargetSelect} noModal={this.props.noModal} limit={this.props.limit} title noFetch={this.props.noFetch}/>
      </Padding>
    );
  },
  renderFilterButtons(){
    if (!!this.props.redux.env.activeBastion && this.props.showFilterButtons){
      return <FilterButtons/>;
    }
    return null;
  },
  render(){
    return (
      <div>
        {this.renderFilterButtons()}
        {this.getIncludes().map(i => {
          const string = i.split('.').map(_.capitalize).reduce((total, n) => total + n);
          return this[`render${string}`]();
        })}
      </div>
    );
  }
});

const mapStateToProps = (state) => ({
  redux: state
});

export default connect(mapStateToProps)(EnvList);