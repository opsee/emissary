import React, {PropTypes} from 'react';
import _ from 'lodash';
import Immutable, {List} from 'immutable';
import GroupItem from './GroupItem.jsx';
import {Alert} from '../../modules/bootstrap';
import {Padding} from '../layout';
import {Link} from 'react-router';
import {GroupActions} from '../../actions';
import {GroupStore} from '../../stores';
import {StatusHandler} from '../global';

export default React.createClass({
  mixins: [GroupStore.mixin],
  propTypes: {
    groups: PropTypes.instanceOf(List),
    offset: PropTypes.number,
    limit: PropTypes.number,
    selected: PropTypes.string,
    ids: PropTypes.array,
    type: PropTypes.string,
    title: PropTypes.string,
    instanceIds: PropTypes.array,
    noFallback: PropTypes.bool
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
        GroupActions.getGroupsSecurity();
        break;
      default:
        GroupActions.getGroupsELB();
        break;
      }
    }
  },
  shouldComponentUpdate(nextProps, nextState){
    return !Immutable.is(this.props.groups, nextProps.groups) || nextState !== this.state;
  },
  storeDidChange(){
    const state = this.getState();
    this.setState(state);
  },
  getState(){
    return {
      status: this.props.type === 'elb' ? GroupStore.getGetGroupsELBStatus() : GroupStore.getGetGroupsSecurityStatus(),
      groups: this.props.type === 'elb' ? GroupStore.getGroupsELB() : GroupStore.getGroupsSecurity()
    };
  },
  getInitialState(){
    return {
      offset: this.props.offset || 0,
      limit: this.props.limit || 4,
      groups: List()
    };
  },
  getGroups(noFilter){
    let data = this.props.groups ? this.props.groups : this.state.groups;
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
    let string = 'envGroupsSecurity';
    if (type === 'elb'){
      string = 'envGroupsELB';
    }
    return string;
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
      <StatusHandler status={this.state.status} noFallback={this.props.noFallback}>
        <Alert bsStyle="default">No groups found</Alert>
      </StatusHandler>
    );
  }
});