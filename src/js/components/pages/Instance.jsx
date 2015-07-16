import React from 'react';
import RadialGraph from '../global/RadialGraph.jsx';
import Actions from '../../actions/InstanceActions';
import Toolbar from '../global/Toolbar.jsx';
import InstanceItem from '../instances/InstanceItem.jsx';
import GroupItem from '../groups/GroupItem.jsx';
import Store from '../../stores/InstanceStore';
import TimeAgo from 'react-components/timeago';

function getState(){
  return Store.getInstance()
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
      <div>
        <Toolbar title={`Instance: ${this.props.name || this.props.id}`}/>
        <div className="container">
          <div className="col-xs-12 col-sm-10 col-sm-offset-1">
              <table className="table">
                <tr>
                  <td><strong>State</strong></td>
                  <td>{this.props.status.state}</td>
                </tr>
                <tr>
                  <td><strong>Last Checked</strong></td>
                  <td><TimeAgo time={this.props.lastChecked}/></td>
                </tr>
                <tr>
                  <td><strong>Created</strong></td>
                  <td><TimeAgo time={this.props.meta.created}/></td>
                </tr>
                <tr>
                  <td><strong>Instance Size</strong></td>
                  <td>{this.props.meta.instanceSize}</td>
                </tr>
              </table>

              <h2>Groups - ( {this.props.groups.length} )</h2>
              <ul className="list-unstyled">
                {this.props.groups.map(i => {
                  return (
                    <li>
                      <GroupItem {...i}/>
                    </li>
                    )
                })}
              </ul>

              <h2>{this.props.checks.length} Checks</h2>
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
    );
  }
});