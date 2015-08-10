import React from 'react';
import RadialGraph from '../global/RadialGraph.jsx';
import Actions from '../../actions/InstanceActions';
import Toolbar from '../global/Toolbar.jsx';
import GroupItem from '../groups/GroupItem.jsx';
import TimeAgo from 'react-timeago';
import InstanceItem from '../instances/InstanceItem.jsx';
import InstanceStore from '../../stores/InstanceStore';
import InstanceActions from '../../actions/InstanceActions';
import {SetIntervalMixin} from '../../mixins';
import Immutable from 'immutable';

function getState(){
  return {
    instance:InstanceStore.getInstance()
  }
}

export default React.createClass({
  mixins: [InstanceStore.mixin, SetIntervalMixin],
  storeDidChange() {
    this.setState(getState());
  },
  getData(){
    InstanceActions.getInstance(this.props.params.id);
  },
  shouldComponentUpdate(nextProps, nextState) {
    return !Immutable.is(this.state.instance, nextState.instance);
  },
  componentWillMount(){
    this.getData()
  },
  componentDidMount(){
    this.setInterval(this.getData, 10000);
  },
  getInitialState(){
    return getState();
  },
  silence(id){
    Actions.silence(id);
  },
  data(){
    return this.state.instance.toJS();
  },
  render() {
    console.log('render');
    return (
      <div>
        <Toolbar title={`Instance: ${this.data().name || this.data().id}`}/>
        <div className="container">
          <div className="col-xs-12 col-sm-10 col-sm-offset-1">
              <table className="table">
                <tr>
                  <td><strong>State</strong></td>
                  <td>{this.data().status.state}</td>
                </tr>
                <tr>
                  <td><strong>Last Checked</strong></td>
                  <td title={`Last Checked: ${this.data().lastChecked.toISOString()}`}>
                    <TimeAgo date={this.data().lastChecked}/>
                  </td>
                </tr>
                <tr>
                  <td><strong>Created</strong></td>
                  <td>
                    <TimeAgo date={this.data().meta.created}/>
                  </td>
                </tr>
                <tr>
                  <td><strong>Instance Size</strong></td>
                  <td>{this.data().meta.instanceSize}</td>
                </tr>
              </table>

              <h2>Groups - ( {this.data().groups.length} )</h2>
              <ul className="list-unstyled">
                {this.state.instance.get('groups').map(i => {
                  return (
                    <li>
                      <GroupItem item={i}/>
                    </li>
                    )
                })}
              </ul>

              <h2>{this.data().checks.length} Checks</h2>
              <ul className="list-unstyled">
                {this.state.instance.get('checks').map(i => {
                  return (
                    <li>
                      <CheckItem item={i}/>
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