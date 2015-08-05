import React from 'react';
import RadialGraph from '../global/RadialGraph.jsx';
import Actions from '../../actions/CheckActions';
import Toolbar from '../global/Toolbar.jsx';
import InstanceItem from '../instances/InstanceItem.jsx';
import Store from '../../stores/CheckStore';
import Link from 'react-router/lib/components/Link';
import Router from 'react-router';
const RouteHandler = Router.RouteHandler;

function getState(){
  return {
    check:Store.newCheck()
  }
}

let checkStep1Data = {}
let checkStep2Data = {}
let checkStep3Data = {}

export default React.createClass({
  mixins: [Store.mixin],
  storeDidChange() {
    this.setState(getState());
  },
  getDefaultProps() {
    return getState();
  },
  silence(id){
    Actions.silence(id);
  },
  stepSubmit(data){
    console.log('step submit', data);
  },
  updateData(data){
    console.log(data);
  },
  updateCheckStep1Data(data){
    checkStep1Data = data;
  },
  updateCheckStep2Data(data){
    checkStep2Data = data;
  },
  updateCheckStep3Data(data){
    checkStep3Data = data;
  },
  submit(){
    var obj = {};
    _.assign(obj, checkStep1Data, checkStep2Data, checkStep3Data);
    console.log(obj);
  },
  render() {
    return (
      <div>
        <RouteHandler {...this.props}  onChange={this.updateData}/>
      </div>
    );
  }
});