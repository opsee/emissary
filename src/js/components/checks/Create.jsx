import React, {PropTypes} from 'react';
import _ from 'lodash';

import {CheckActions, GlobalActions, UserActions} from '../../actions';
import {Alert} from '../../modules/bootstrap';
import {StatusHandler} from '../global';
import {CheckStore} from '../../stores';
import {RouteHandler} from 'react-router';
import router from '../../modules/router';
import {PageAuth} from '../../modules/statics';

const CheckCreate = React.createClass({
  mixins: [CheckStore.mixin],
  statics: {
    willTransitionTo: PageAuth
  },
  propTypes: {
    query: PropTypes.object
  },
  storeDidChange() {
    const state = this.getState(true);
    if (state.createStatus === 'success'){
      UserActions.userPutUserData('hasDismissedCheckCreationHelp');
      router.transitionTo('checks');
    }else if (state.createStatus && state.createStatus !== 'pending'){
      GlobalActions.globalModalMessage({
        html: status.body && status.body.message || 'Something went wrong.',
        style: 'danger'
      });
    }
    this.setState(state);
  },
  getState(noCheck){
    const obj = {
      check: CheckStore.newCheck(this.props.query).toJS(),
      response: CheckStore.getResponse(),
      createStatus: CheckStore.getCheckCreateStatus(),
      filter: null
    };
    return _.omit(obj, noCheck ? 'check' : null);
  },
  getInitialState(){
    return this.getState();
  },
  setStatus(obj){
    this.setState(_.extend(this.state.statuses, obj));
  },
  setData(data){
    this.setState({
      check: _.cloneDeep(data)
    });
  },
  setFilter(data){
    this.setState({
      filter: data
    });
  },
  handleSubmit(){
    CheckActions.checkCreate(this.state.check);
  },
  render() {
    return (
      <div>
        <RouteHandler {...this.state} onChange={this.setData} onSubmit={this.handleSubmit} setStatus={this.setStatus} onFilterChange={this.setFilter}/>
        <StatusHandler status={this.state.createStatus}>
          <Alert bsStyle="danger">Something went wrong.</Alert>
        </StatusHandler>
      </div>
    );
  }
});

export default CheckCreate;