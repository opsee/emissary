import React from 'react';
import RadialGraph from '../global/RadialGraph.jsx';
import Actions from '../../actions/CheckActions';
import Toolbar from '../global/Toolbar.jsx';
import InstanceItem from '../instances/InstanceItem.jsx';
import Store from '../../stores/CheckStore';
import CheckItem from '../checks/CheckItem.jsx';

function getState(){
  return {
    checks:Store.getChecks()
  }
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
        <Toolbar title="All Checks">
          <button ng-click="edit()" className="btn btn-primary btn-fab" title="Edit {{::check.name}}">
          </button>
        </Toolbar>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-10 col-sm-offset-1">
              <h2>Check Information</h2>
              <ul className="list-unstyled">
                {this.props.checks.map(i => {
                  return (
                    <li>
                      <CheckItem {...i}/>
                    </li>
                    )
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
});