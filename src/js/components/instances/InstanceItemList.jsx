import React from 'react';
import InstanceItem from './InstanceItem.jsx';
import {Alert} from '../../modules/bootstrap';
import Immutable, {List} from 'immutable';
import {Button} from '../forms';
import {ChevronDown} from '../icons';

export default React.createClass({
  propTypes: {
    instances: React.PropTypes.instanceOf(List),
    offset: React.PropTypes.number,
    limit: React.PropTypes.number
  },
  shouldComponentUpdate(nextProps, nextState){
    return !Immutable.is(this.props.instances, nextProps.instances) || nextState !== this.state;
  },
  getInitialState(){
    return {
      offset: this.props.offset || 0,
      limit: this.props.limit || 4
    };
  },
  getMore(){
    this.setState({
      limit: 1000
    });
  },
  getInstances(){
    return this.props.instances.slice(this.state.offset, this.state.limit);
  },
  renderMoreButton(){
    if (this.state.limit < this.props.instances.size){
      return (
        <Button color="primary" flat onClick={this.getMore} className="margin-t">
          Show {this.props.instances.size - this.state.limit} more <ChevronDown inline fill="primary"/>
        </Button>
      );
    }
  },
  render(){
    if (this.props.instances.size){
      return (
        <div>
          {this.getInstances().map(instance => {
            return <InstanceItem item={instance} key={instance.get('id')}/>;
          })}
          {this.renderMoreButton()}
        </div>
      );
    }
    return (
      <div>
        <Alert bsStyle="default">No instances found</Alert>
      </div>
    );
  }
});