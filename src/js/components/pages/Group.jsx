import React from 'react';
import RadialGraph from '../global/RadialGraph.jsx';
import Toolbar from '../global/Toolbar.jsx';
import InstanceItem from '../instances/InstanceItem.jsx';
import TimeAgo from 'react-components/timeago';
import GroupItem from '../groups/GroupItem.jsx';
import GroupStore from '../../stores/GroupStore';
import GroupActions from '../../actions/GroupActions';
import {SetIntervalMixin} from '../../mixins';
import Immutable from 'immutable';

function getState(){
  return {
    group:GroupStore.getGroup()
  }
}

export default React.createClass({
  mixins: [GroupStore.mixin, SetIntervalMixin],
  storeDidChange() {
    this.setState(getState());
  },
  shouldComponentUpdate(nextProps, nextState) {
    return !Immutable.is(this.state.group, nextState.group);
  },
  getData(){
    GroupActions.getGroup(this.props.params.id);
  },
  componentWillMount(){
    this.getData();
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
  render() {
    return (
      <div>
        <Toolbar title={`Group: ${this.state.group.get('name') || this.state.group.get('id') || ''}`}/>
        <div className="container">
          <div className="col-xs-12 col-sm-10 col-sm-offset-1">
              <table className="table">
                <tr>
                  <td><strong>State</strong></td>
                  <td>{this.state.group.get('status').state}</td>
                </tr>
                <tr>
                  <td><strong>Id</strong></td>
                  <td>{this.state.group.get('id')}</td>
                </tr>
              </table>

              <h2>Instances - ( {this.state.group.get('instances').size} )</h2>
              <ul className="list-unstyled">
                {this.state.group.get('instances').map(i => {
                  return (
                    <li>
                      <InstanceItem item={i}/>
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