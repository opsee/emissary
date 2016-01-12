import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';

import {SetInterval} from '../../modules/mixins';
import {GroupItemList} from '../groups';
import {InstanceItemList} from '../instances';

const EnvList = React.createClass({
  mixins: [SetInterval],
  propTypes: {
    include: PropTypes.array,
    filter: PropTypes.bool,
    onFilterChange: PropTypes.func,
    onTargetSelect: PropTypes.func,
    noModal: PropTypes.bool,
    limit: PropTypes.number,
    redux: PropTypes.shape({
      asyncActions: PropTypes.object,
      search: PropTypes.shape({
        string: PropTypes.string
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
        bastions: PropTypes.array,
        search: PropTypes.string
      })
    })
  },
  getDefaultProps(){
    return {
      include: ['groupsSecurity', 'groupsELB', 'instancesRds', 'instancesECC'],
      limit: 1000
    };
  },
  renderGroupsSecurity(){
    return (
      <div key="groupsSecurity">
        <GroupItemList filter={this.props.filter} type="security" onClick={this.props.onTargetSelect} noModal={this.props.noModal} limit={this.props.limit} title="Security Groups"/>
        <hr/>
      </div>
    );
  },
  renderGroupsELB(){
    return (
      <div key="groupsELB">
        <GroupItemList type="elb" filter={this.props.filter} onClick={this.props.onTargetSelect} noModal={this.props.noModal} limit={this.props.limit} title="ELBs"/>
        <hr/>
      </div>
    );
  },
  renderInstancesECC(){
    return (
      <div key="instancesECC">
        <InstanceItemList filter={this.props.filter} onClick={this.props.onTargetSelect} noModal={this.props.noModal} limit={this.props.limit} type="ecc" title/>
        <hr/>
      </div>
    );
  },
  renderInstancesRds(){
    return (
      <div key="instancesRds">
        <InstanceItemList filter={this.props.filter} onClick={this.props.onTargetSelect} noModal={this.props.noModal} limit={this.props.limit} type="rds" title/>
        <hr/>
      </div>
    );
  },
  render(){
    const self = this;
    return (
      <div>
        {this.props.include.map(i => {
          return self[`render${_.capitalize(i)}`]();
        })}
      </div>
    );
  }
});

const mapStateToProps = (state) => ({
  redux: state
});

export default connect(mapStateToProps)(EnvList);