import React, {PropTypes} from 'react';
import {RadialGraph, ListItem, StatusHandler} from '../global';
import {InstanceActions} from '../../actions';
import {InstanceStore} from '../../stores';
import InstanceItem from './InstanceItem.jsx';
import {Link} from 'react-router';
import {MoreHoriz} from '../icons';
import Immutable, {Record, List, Map} from 'immutable';
import {Button} from '../forms';

export default React.createClass({
  propTypes:{
    instances:React.PropTypes.instanceOf(List),
    offset:React.PropTypes.number,
    limit:React.PropTypes.number
  },
  shouldComponentUpdate(nextProps, nextState){
    return !Immutable.is(this.props.instances, nextProps.instances) || nextState != this.state;
  },
  getInitialState(){
    return {
      offset:this.props.offset || 0,
      limit:this.props.limit || 6
    }
  },
  getMore(){
    this.setState({
      limit:1000
    });
  },
  getInstances(){
    return this.props.instances.slice(this.state.offset, this.state.limit);
  },
  renderMoreButton(){
    if(this.state.limit < this.props.instances.size){
      return <Button onClick={this.getMore} className="pull-right">Show All</Button>
    }
  },
  render(){
    if(this.props.instances.size){
      return(
        <div>
          {this.getInstances().map(instance => {
            return <InstanceItem item={instance} key={instance.get('id')}/>
          })}
          {this.renderMoreButton()}
        </div>
      )
    }else{
      return (
        <div>
          <p>No Instances</p>
        </div>
      )
    }
  }
});