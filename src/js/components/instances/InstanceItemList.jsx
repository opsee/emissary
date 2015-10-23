import React, {PropTypes} from 'react';
import {RadialGraph, ListItem, StatusHandler} from '../global';
import {InstanceActions} from '../../actions';
import {InstanceStore} from '../../stores';
import InstanceItem from './InstanceItem.jsx';
import {Alert} from '../../modules/bootstrap';
import {Link} from 'react-router';
import {MoreHoriz} from '../icons';
import Immutable, {Record, List, Map} from 'immutable';
import {Button} from '../forms';
import {ChevronDown} from '../icons';

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
      limit:this.props.limit || 4
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
      return <Button bsStyle="primary" flat={true} onClick={this.getMore} className="margin-t">Show {this.props.instances.size - this.state.limit} more <ChevronDown className="icon"/></Button>
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
          <Alert bsStyle="default">No instances found</Alert>
        </div>
      )
    }
  }
});