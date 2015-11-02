import React, {PropTypes} from 'react';
import Immutable, {List} from 'immutable';
import GroupItem from './GroupItem.jsx';
import {Alert} from '../../modules/bootstrap';
import {Padding} from '../layout';
import {Link} from 'react-router';

export default React.createClass({
  propTypes: {
    groups: PropTypes.instanceOf(List).isRequired,
    offset: PropTypes.number,
    limit: PropTypes.number,
    selected: PropTypes.string
  },
  shouldComponentUpdate(nextProps, nextState){
    return !Immutable.is(this.props.groups, nextProps.groups) || nextState !== this.state;
  },
  getInitialState(){
    return {
      offset: this.props.offset || 0,
      limit: this.props.limit || 4
    };
  },
  getGroups(){
    return this.props.groups.slice(this.state.offset, this.state.limit);
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
    if (this.state.limit < this.props.groups.size){
      return (
        <Padding t={1}>
          <Link to={this.getEnvLink()}>
            Show {this.props.groups.size - this.state.limit} more
          </Link>
        </Padding>
      );
    }
    return <span/>;
  },
  render() {
    const self = this;
    if (this.props.groups.size){
      return (
        <div>
          {this.getGroups().map((group, i) => {
            return <GroupItem item={group} tabIndex={i} selected={self.isSelected(group.get('id'))} notSelected={self.isNotSelected(group.get('id'))} {...this.props} key={group.get('id')}/>;
          })}
          {this.renderLink()}
        </div>
      );
    }
    return (
      <Alert bsStyle="default">
        No groups
      </Alert>
    );
  }
});