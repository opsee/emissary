import React, {PropTypes} from 'react';
import {RadialGraph} from '../global';
import {Toolbar, StatusHandler} from '../global';
import GroupItem from '../groups/GroupItem.jsx';
import {GroupStore} from '../../stores';
import {GroupActions} from '../../actions';
import {Button} from '../forms';

function getState(){
  return {
    groups: GroupStore.getGroupsSecurity(),
    status: GroupStore.getGetGroupsSecurityStatus()
  }
}
export default React.createClass({
  mixins: [GroupStore.mixin],
  storeDidChange() {
    const state = getState();
    this.setState(state);
  },
  componentWillMount(){
    GroupActions.getGroupsSecurity();
  },
  getInitialState(){
    return getState();
  },
  getFailingGroups(){
    return this.state.groups.filter(i => {
      return i.get('health') < 100;
    });
  },
  getPassingGroups(){
    return this.state.groups.filter(i => {
      return i.get('health') == 100;
    });
  },
  renderFailingGroups(){
    const groups = this.getFailingGroups();
    if (groups.size){
      return (
        <div>
        <h3>Failing Groups</h3>
            {groups.map((group, i) => {
              return <GroupItem item={group}/>
            })}
        </div>
      )
    }
  },
  render() {
    if (this.state.groups.size){
      return (
        <div>
          {this.renderFailingGroups()}
          <h3>Passing Groups</h3>

            {this.getPassingGroups().map((group, i) => {
              return <GroupItem item={group}/>
            })}
        </div>
      );
    }else {
      return (
        <StatusHandler status={this.state.status}>
          No Groups found.
        </StatusHandler>
      );
    }
  }
});
