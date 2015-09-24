import React, {PropTypes} from 'react';
import {RadialGraph, ListItem, StatusHandler} from '../global';
import {InstanceActions} from '../../actions';
import {InstanceStore} from '../../stores';
import InstanceItem from './InstanceItem.jsx';
import {Link} from 'react-router';
import {MoreHoriz} from '../icons';
import Immutable, {Record, List, Map} from 'immutable';

export default React.createClass({
  mixins:[InstanceStore.mixin],
  propTypes:{
    type:PropTypes.string.isRequired,
    id:PropTypes.string.isRequired
  },
  getState(){
    return {
      status:InstanceStore.getGetInstancesECCStatus(),
      instances:InstanceStore.getInstancesECC(this.props.id)
    }
  },
  storeDidChange(){
    let state = this.getState();
    let error = false;
    if(state.status == 'error'){
      error = state.status;
    }
    state.error = error;
    this.setState(state);
  },
  getInitialState(){
    return this.getState();
  },
  componentWillMount(){
    InstanceActions.getInstancesECC();
  },
  renderInstances(){
    if(this.state.instances.size){
      return(
        <div>
          <h2>Instances ({this.state.instances.size})</h2>
          <ul className="list-unstyled">
            {this.state.instances.map(instance => {
              return (
                <li key={instance.get('id')}>
                  <InstanceItem item={instance}/>
                </li>
                )
            })}
          </ul>
        </div>
      )
    }else{
      return (
        <StatusHandler status={this.state.status}>
          <h2>No Instances</h2>
        </StatusHandler>
      );
    }
  },
  render() {
    return this.renderInstances();
  }
});