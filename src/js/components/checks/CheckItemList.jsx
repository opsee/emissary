import React, {PropTypes} from 'react';
import Immutable from 'immutable';

import {StatusHandler} from '../global';
import {CheckActions} from '../../actions';
import {CheckStore} from '../../stores';
import {Alert} from '../../modules/bootstrap';
import CheckItem from './CheckItem.jsx';
import {SetInterval} from '../../modules/mixins';

const CheckItemList = React.createClass({
  mixins: [CheckStore.mixin, SetInterval],
  propTypes: {
    type: PropTypes.string,
    target: PropTypes.string
  },
  componentWillMount(){
    CheckActions.getChecks();
    this.setInterval(CheckActions.getChecks, 15000);
  },
  shouldComponentUpdate(nextProps, nextState) {
    return !Immutable.is(this.state.checks, nextState.checks) || nextState.status !== this.state.status;
  },
  storeDidChange(){
    let state = this.getState();
    let error = false;
    if (state.status === 'error'){
      error = state.status;
    }
    state.error = error;
    this.setState(state);
  },
  getState(){
    return {
      status: CheckStore.getGetChecksStatus(),
      checks: CheckStore.getChecks()
    };
  },
  getInitialState(){
    return this.getState();
  },
  getChecks(){
    let data = CheckStore.getChecks();
    if (this.props.target){
      data = data.filter(c => {
        return c.get('target').id === this.props.target;
      });
    }
    return data;
  },
  render() {
    if (this.getChecks().size){
      return (
        <div>
          {this.getChecks().map(c => {
            return <CheckItem item={c} key={c.get('id')}/>;
          })}
        </div>
      );
    }
    return (
      <StatusHandler status={this.state.status}>
        <Alert bsStyle="default">No checks applied</Alert>
      </StatusHandler>
    );
  }
});

export default CheckItemList;