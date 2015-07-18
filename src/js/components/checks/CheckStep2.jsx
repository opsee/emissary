import React from 'react';
import RadialGraph from '../global/RadialGraph.jsx';
import Actions from '../../actions/CheckActions';
import Store from '../../stores/CheckStore';
import Link from 'react-router/lib/components/Link';

function getState(){
  return {
    checks: Store.getChecks()
  }
}

export default React.createClass({
  getInitialState() {
    return {
      on:false
    }
  },
  silence(id){
    Actions.silence(id);
  },
  handleClick() {
    this.setState({
      on:!this.state.on
    })
  },
  render() {
    return (
      <form name="checkStep1Form" className="ng-hide" ng-show="!checkStep || checkStep == 1" ng-submit="forward(2)">
      </form>
    );
  }
});