import React, {PropTypes} from 'react';
import {RadialGraph, ListItem, StatusHandler} from '../global';
import {CheckActions} from '../../actions';
import {CheckStore} from '../../stores';
import CheckItem from './CheckItem.jsx';
import {Link} from 'react-router';
import {MoreHoriz} from '../icons';
import Immutable, {Record, List, Map} from 'immutable';

export default React.createClass({
  mixins:[CheckStore.mixin],
  propTypes:{
    type:PropTypes.string.isRequired,
    id:PropTypes.string.isRequired
  },
  getState(){
    return {
      status:CheckStore.getGetChecksStatus(),
      checks:CheckStore.getChecks(this.props.id)
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
    CheckActions.getChecks();
  },
  renderChecks(){
    if(this.state.checks.size){
      return(
        <div>
          <h2>Checks Applied</h2>
          <ul className="list-unstyled">
            {this.state.checks.map(c => {
              return (
                <li key={c.get('id')}>
                  <CheckItem item={c}/>
                </li>
                )
            })}
          </ul>
        </div>
      )
    }else{
      return (
        <StatusHandler status={this.state.status}>
          <h2>No Checks Applied</h2>
        </StatusHandler>
      );
    }
  },
  render() {
    return this.renderChecks();
  }
});