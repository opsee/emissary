import React from 'react';
import RadialGraph from '../global/RadialGraph.jsx';
import Actions from '../../actions/Check';
import Toolbar from '../global/Toolbar.jsx';
import InstanceItem from '../instances/InstanceItem.jsx';
import Store from '../../stores/Check';

function getState(){
  return Store.getCheck()
}

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
  render() {
    return (
      <div className="bg-body" style={{position:"relative"}}>
        Check Not Found.
      </div>
    );
  }
});