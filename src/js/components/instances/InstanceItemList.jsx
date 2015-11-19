import React, {PropTypes} from 'react';
import InstanceItem from './InstanceItem.jsx';
import {Alert} from '../../modules/bootstrap';
import Immutable, {List} from 'immutable';
import {Padding} from '../layout';
import {Link} from 'react-router';
import {StatusHandler} from '../global';
import {InstanceActions} from '../../actions';
import {InstanceStore} from '../../stores';

export default React.createClass({
  mixins: [InstanceStore.mixin],
  propTypes: {
    instances: PropTypes.instanceOf(List),
    offset: PropTypes.number,
    limit: PropTypes.number,
    ids: PropTypes.array,
    noFallback: PropTypes.bool
  },
  componentWillMount(){
    if (!this.props.instances){
      InstanceActions.getInstancesECC();
    }
  },
  shouldComponentUpdate(nextProps, nextState){
    return !Immutable.is(this.props.instances, nextProps.instances) || nextState !== this.state;
  },
  storeDidChange(){
    const state = this.getState();
    this.setState(state);
  },
  getState(){
    return {
      status: InstanceStore.getGetInstancesECCStatus(),
      instances: InstanceStore.getInstancesECC()
    };
  },
  getInitialState(){
    return {
      offset: this.props.offset || 0,
      limit: this.props.limit || 8,
      instances: List()
    };
  },
  getInstances(noFilter){
    let data = this.props.instances ? this.props.instances : this.state.instances;
    if (noFilter){
      return data;
    }
    if (this.props.ids){
      data = data.filter(d => {
        return this.props.ids.indexOf(d.id) > -1;
      });
    }
    data = data.sortBy(item => {
      return typeof item.get('health') === 'number' ? item.get('health') : 101;
    });
    return data.slice(this.state.offset, this.state.limit);
  },
  getMore(){
    this.setState({
      limit: 1000
    });
  },
  renderLink(){
    if (this.props.instances && this.state.limit < this.getInstances(true).size){
      return (
        <Padding t={1}>
          <Link to="envInstancesEC2">
            Show {this.getInstances(true).size - this.state.limit} more
          </Link>
        </Padding>
      );
    }
    return <span/>;
  },
  render(){
    if (this.getInstances().size){
      return (
        <div>
          {this.getInstances().map(instance => {
            return <InstanceItem item={instance} key={instance.get('id')} {...this.props}/>;
          })}
          {this.renderLink()}
        </div>
      );
    }
    return (
      <StatusHandler status={this.state.status} noFallback={this.props.noFallback}>
        <Alert bsStyle="default">No instances found</Alert>
      </StatusHandler>
    );
  }
});