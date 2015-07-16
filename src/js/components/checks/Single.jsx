import React from 'react';
import RadialGraph from '../global/RadialGraph.jsx';
import Actions from '../../actions/CheckActions';
import Toolbar from '../global/Toolbar.jsx';
import InstanceItem from '../instances/InstanceItem.jsx';
import Store from '../../stores/CheckStore';

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
        <Toolbar title={`Check ${this.props.name || this.props.params.id}`}>
          <button ng-click="edit()" className="btn btn-primary btn-fab" title="Edit {{::check.name}}">

          </button>
        </Toolbar>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-10 col-sm-offset-1">
              <h2>Check Information</h2>
              <table className="table">
                <tbody>
                {this.props.meta.map(i => {
                  return (
                    <tr>
                      <td><strong>{i.key}</strong></td>
                      <td>{i.value}</td>
                    </tr>
                    )
                })}
                </tbody>
              </table>
              <h2>Check Instances</h2>
              <ul className="list-unstyled">
                {this.props.instances.map(i => {
                  return (
                    <li>
                      <InstanceItem {...i}/>
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