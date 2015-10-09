import React from 'react';
import Immutable, {List} from 'immutable';
import GroupItem from './GroupItem.jsx';
import {Alert} from '../../modules/bootstrap';
import {Button} from '../forms';
import {ChevronDown} from '../icons';

export default React.createClass({
  propTypes:{
    groups:React.PropTypes.instanceOf(List).isRequired,
    offset:React.PropTypes.number,
    limit:React.PropTypes.number
  },
  shouldComponentUpdate(nextProps, nextState){
    return !Immutable.is(this.props.groups, nextProps.groups) || nextState != this.state;
  },
  getInitialState(){
    return {
      offset:this.props.offset || 0,
      limit:this.props.limit || 6
    }
  },
  getGroups(){
    return this.props.groups.slice(this.state.offset, this.state.limit);
  },
  isSelected(id){
    return this.props.selected && this.props.selected == id;
  },
  isNotSelected(id){
    return this.props.selected && this.props.selected != id;
  },
  getMore(){
    // const limit = this.state.limit;
    // this.setState({
    //   limit:limit+(this.props.limit || 6)
    // });
    this.setState({
      limit:1000
    });
  },
  renderMoreButton(){
    if(this.state.limit < this.props.groups.size){
      return <Button onClick={this.getMore} className="margin-t btn btn-flat btn-primary">Show {this.props.groups.size - this.state.limit} more <ChevronDown className="icon"/></Button>
    }
  },
  render() {
    const self = this;
    if(this.props.groups.size){
      return(
        <div>
          {this.getGroups().map((group, i) => {
            return <GroupItem item={group} tabIndex={i} selected={self.isSelected(group.get('id'))} notSelected={self.isNotSelected(group.get('id'))} {...this.props} key={group.get('id')}/>
          })}
          {this.renderMoreButton()}
        </div>
      )
    }else{
      return (
        <div>
          <Alert bsStyle="default">
            No groups
          </Alert>
        </div>
      )
    }
  }
});