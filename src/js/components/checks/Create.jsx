import React from 'react';
import RadialGraph from '../global/RadialGraph.jsx';
import Actions from '../../actions/Check';
import Toolbar from '../global/Toolbar.jsx';
import InstanceItem from '../instances/InstanceItem.jsx';
import Store from '../../stores/Check';
import Link from 'react-router/lib/components/Link';
import Router, {RouteHandler} from 'react-router';
import _ from 'lodash';

function getState(){
  return {
    check:Store.newCheck().toJS(),
    statuses:{
      step1:null,
      step2:null,
      step3:null
    }
  }
}

export default React.createClass({
  mixins: [Store.mixin],
  storeDidChange() {
    this.setState(getState());
  },
  getInitialState:getState,
  silence(id){
    Actions.silence(id);
  },
  stepSubmit(data){
    console.log('step submit', data);
  },
  setStatus(obj){
    this.setState(_.extend(this.state.statuses, obj));
  },
  updateData(data){
    let obj = _.assign(this.state.check, data);
    this.setState({
      check:obj
    });
  },
  submit(){
    console.log(this.state.check);
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