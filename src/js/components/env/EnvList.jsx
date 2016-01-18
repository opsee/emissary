import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';

import {SetInterval} from '../../modules/mixins';
import {GroupItemList} from '../groups';
import {CheckItemList} from '../checks';
import {InstanceItemList} from '../instances';
import {FilterButtons} from '../search';

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
        bastions: PropTypes.array,
        search: PropTypes.string
      })
    })
  },
  getDefaultProps(){
    return {
      include: ['groups.elb', 'groups.security', 'instances.rds', 'instances.ecc', 'checks.checks'],
      limit: 1000
    };
  },
  renderGroupsSecurity(){
    return (
      <div key="groupsSecurity">
        <GroupItemList filter={this.props.filter} type="security" onClick={this.props.onTargetSelect} noModal={this.props.noModal} limit={this.props.limit} title="Security Groups" noFetch={this.props.noFetch}/>
        <hr/>
      </div>
    );
  },
  renderGroupsElb(){
    return (
      <div key="groupsELB">
        <GroupItemList type="elb" filter={this.props.filter} onClick={this.props.onTargetSelect} noModal={this.props.noModal} limit={this.props.limit} title="ELBs" noFetch={this.props.noFetch}/>
        <hr/>
      </div>
    );
  },
  renderInstancesEcc(){
    return (
      <div key="instancesECC">
        <InstanceItemList filter={this.props.filter} onClick={this.props.onTargetSelect} noModal={this.props.noModal} limit={this.props.limit} type="ecc" title noFetch={this.props.noFetch}/>
        <hr/>
      </div>
    );
  },
  renderInstancesRds(){
    return (
      <div key="instancesRds">
        <InstanceItemList filter={this.props.filter} onClick={this.props.onTargetSelect} noModal={this.props.noModal} limit={this.props.limit} type="rds" title noFetch={this.props.noFetch}/>
        <hr/>
      </div>
    );
  },
  renderChecksChecks(){
    return (
      <div key="checks">
        <CheckItemList filter={this.props.filter} onClick={this.props.onTargetSelect} noModal={this.props.noModal} limit={this.props.limit} title noFetch={this.props.noFetch}/>
        <hr/>
      </div>
    );
  },
  renderFilterButtons(){
    if (this.props.showFilterButtons){
      return <FilterButtons/>;
    }
    return null;
  },
  render(){
    const self = this;
    let {include} = this.props;
    if (this.props.filter){
      include = _.sortBy(include, i => {
        let size = _.get(this.props.redux.env.filtered, `${i}.size`);
        if (i === 'checks.checks'){
          size = this.props.redux.checks.filtered.size;
        }
        return (-1 * size) || 0;
      });
    }
    return (
      <div>
        {this.renderFilterButtons()}
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