import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {List} from 'immutable';
import GroupItem from './GroupItem.jsx';
import {Alert} from '../../modules/bootstrap';
import {Padding} from '../layout';
import {Link} from 'react-router';
import {StatusHandler} from '../global';
import {env as actions} from '../../reduxactions';

const GroupItemList = React.createClass({
  propTypes: {
    groups: PropTypes.instanceOf(List),
    offset: PropTypes.number,
    limit: PropTypes.number,
    selected: PropTypes.string,
    ids: PropTypes.array,
    type: PropTypes.string,
    title: PropTypes.string,
    instanceIds: PropTypes.array,
    noFallback: PropTypes.bool,
    actions: PropTypes.shape({
      getGroupsElb: PropTypes.func,
      getGroupsSecurity: PropTypes.func
    }),
    redux: PropTypes.shape({
      asyncActions: PropTypes.object,
      env: PropTypes.shape({
        groups: PropTypes.shape({
          security: PropTypes.object,
          elb: PropTypes.object
        })
      })
    }).isRequired
  },
  getDefaultProps(){
    return {
      type: 'security'
    };
  },
  componentWillMount(){
    if (!this.props.groups){
      switch (this.props.type){
      case 'elb':
        this.props.actions.getGroupsElb();
        break;
      default:
        this.props.actions.getGroupsSecurity();
        break;
      }
    }
  },
  getInitialState(){
    return {
      offset: this.props.offset || 0,
      limit: this.props.limit || 8
    };
  },
  getGroups(noFilter){
    let data = this.props.groups || this.props.redux.env.groups[this.props.type];
    if (noFilter){
      return data;
    }
    if (this.props.ids){
      data = data.filter(d => {
        return this.props.ids.indexOf(d.id) > -1;
      });
    }
    if (this.props.instanceIds){
      data = data.filter(d => {
        return _.intersection(this.props.instanceIds, _.pluck(d.get('instances').toJS(), 'id')).length;
      });
    }
    data = data.sortBy(item => {
      return typeof item.get('health') === 'number' ? item.get('health') : 101;
    });
    return data.slice(this.state.offset, this.state.limit);
  },
  getMore(){
    // const limit = this.state.limit;
    // this.setState({
    //   limit: limit+(this.props.limit || 6)
    // });
    this.setState({
      limit: 1000
    });
  },
  getGroupType(){
    if (this.props.groups.size){
      return this.props.groups.get(0).get('type');
    }
    return 'security';
  },
  getEnvLink(){
    const type = this.getGroupType();
    let string = '/env-groups-security';
    if (type === 'elb'){
      string = '/env-groups-elb';
    }
    return string;
  },
  getStatus(){
    switch (this.props.type){
    case 'elb':
      return this.props.redux.asyncActions.getGroupsElb.status;
    default:
      return this.props.redux.asyncActions.getGroupsSecurity.status;
    }
  },
  isSelected(id){
    return this.props.selected && this.props.selected === id;
  },
  isNotSelected(id){
    return this.props.selected && this.props.selected !== id;
  },
  renderLink(){
    if (this.props.groups && this.state.limit < this.getGroups(true).size){
      return (
        <Padding t={1}>
          <Link to={this.getEnvLink()}>
            Show {this.getGroups(true).size - this.state.limit} more
          </Link>
        </Padding>
      );
    }
    return <span/>;
  },
  renderTitle(){
    if (this.props.title){
      if (this.props.groups){
        return <h3>{this.props.title} ({this.getGroups(true).size})</h3>;
      }
      return <h3>{this.props.title} ({this.getGroups().size})</h3>;
    }
    return <span/>;
  },
  render() {
    if (this.getGroups().size){
      return (
        <div>
          {this.renderTitle()}
          {this.getGroups().map((group, i) => {
            return <GroupItem item={group} tabIndex={i} selected={this.isSelected(group.get('id'))} notSelected={this.isNotSelected(group.get('id'))} {...this.props} key={group.get('id')}/>;
          })}
          {this.renderLink()}
        </div>
      );
    }
    return (
      <StatusHandler status={this.getStatus()} noFallback={this.props.noFallback}>
        <Alert bsStyle="default">No groups found</Alert>
      </StatusHandler>
    );
  }
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(null, mapDispatchToProps)(GroupItemList);