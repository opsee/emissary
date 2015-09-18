import React from 'react';
import {CheckActions} from '../../actions';
import {Toolbar} from '../global';
import {CheckStore} from '../../stores';
import InstanceItem from '../instances/InstanceItem.jsx';
import {Link} from 'react-router';
import Router, {RouteHandler} from 'react-router';
import _ from 'lodash';

function getState(){
  return {
    check:CheckStore.newCheck().toJS(),
    response:CheckStore.getResponse()
  }
}

export default React.createClass({
  mixins: [CheckStore.mixin],
  storeDidChange() {
    this.setState(getState());
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
      check:_.extend(this.state.check, data)
    });
  },
  submit(){
    CheckActions.checkCreate(this.state.check);
  },
  render() {
    return (
      <div>
      {
        //<pre>{JSON.stringify(this.state.check, null, ' ')}</pre>
      }
        <RouteHandler {...this.state}  onChange={this.updateData} onSubmit={this.submit} setStatus={this.setStatus}/>
      </div>
    );
  }
});