import React from 'react';
import _ from 'lodash';

import {CheckActions, GlobalActions} from '../../actions';
import {Toolbar} from '../global';
import {CheckStore} from '../../stores';
import {InstanceItem} from '../instances';
import {Link} from 'react-router';
import {RouteHandler} from 'react-router';
import router from '../../modules/router';
import {PageAuth} from '../../modules/statics';

function getState(noCheck){
  const obj = {
    check:CheckStore.newCheck().toJS(),
    response:CheckStore.getResponse(),
    createStatus:CheckStore.getCheckCreateStatus()
  }
  return _.omit(obj, noCheck ? 'check' : null)
}

const CheckCreate = React.createClass({
  mixins: [CheckStore.mixin],
  statics:{
    willTransitionTo:PageAuth
  },
  storeDidChange() {
    const state = getState(true);
    if(state.createStatus == 'success'){
      router.transitionTo('checks');
    }else if(state.createStatus && state.createStatus != 'pending'){
      GlobalActions.globalModalMessage({
        html:status.body && status.body.message || 'Something went wrong.',
        style:'danger'
      });
    }
    this.setState(state);
  },
  getInitialState:getState,
  silence(id){
    CheckActions.silence(id);
  },
  setStatus(obj){
    this.setState(_.extend(this.state.statuses, obj));
  },
  updateData(data){
    this.setState({
      check:_.merge(this.state.check, data)
    });
  },
  submit(){
    CheckActions.checkCreate(this.state.check);
  },
  render() {
    return (
      <div>
        <RouteHandler {...this.state}  onChange={this.updateData} onSubmit={this.submit} setStatus={this.setStatus}/>
      </div>
    );
  }
});

export default CheckCreate;