import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';

import {SetInterval} from '../../modules/mixins';
import {GroupItemList} from '../groups';
import {InstanceItemList} from '../instances';

const EnvList = React.createClass({
  mixins: [SetInterval],
  propTypes: {
    include: PropTypes.arrayOf(PropTypes.oneOf([
      'groups.security',
      'groups.elb',
      'instances.ecc',
      'instances.rds'
    ])),
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
        bastions: PropTypes.array,
        search: PropTypes.string
      })
    })
  },
  getDefaultProps(){
    return {
      include: ['groups.elb', 'groups.security', 'instances.rds', 'instances.ecc'],
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
  renderGroupsElb(){
    return (
      <div key="groupsELB">
        <GroupItemList type="elb" filter={this.props.filter} onClick={this.props.onTargetSelect} noModal={this.props.noModal} limit={this.props.limit} title="ELBs"/>
        <hr/>
      </div>
    );
  },
  renderInstancesEcc(){
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
    let {include} = this.props;
    if (this.props.filter){
      include = _.sortBy(include, i => {
        return -1 * (_.get(this.props.redux.env.filtered, `${i}.size`) || 0);
      });
    }
    return (
      <div>
        {include.map(i => {
          const string = i.split('.').map(_.capitalize).reduce((total, n) => total + n);
          return self[`render${string}`]();
        })}
      </div>
    );
  }
});

const mapStateToProps = (state) => ({
  redux: state
});

export default connect(mapStateToProps)(EnvList);