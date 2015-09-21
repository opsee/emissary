import React, {PropTypes} from 'react';
import {Button} from '../../modules/bootstrap';
import {RadialGraph} from '../global';
import {Toolbar, Loader} from '../global';
import GroupItem from '../groups/GroupItem.jsx';
import {GroupStore} from '../../stores';
import {GroupActions} from '../../actions';

function getState(){
  return {
    groups: GroupStore.getGroupsSecurity(),
    status:GroupStore.getGetGroupsSecurityStatus()
  }
}
export default React.createClass({
  mixins: [GroupStore.mixin],
  storeDidChange() {
    this.setState(getState());
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
    if(groups.size){
      return (
        <div>
        <h3>Failing Groups</h3>
          <ul className="list-unstyled">
            {groups.map((group, i) => {
              return (
                <li key={i}>
                  <GroupItem item={group}/>
                </li>
                )
            })}
          </ul>
        </div>
      )
    }
  },
  render() {
    if(this.state.groups.size){
      return (
        <div>
          {this.renderFailingGroups()}
          <h3>Passing Groups</h3>
          <ul className="list-unstyled">
            {this.getPassingGroups().map((group, i) => {
              return (
                <li key={i}>
                  <GroupItem item={group}/>
                </li>
                )
            })}
          </ul>
        </div>
      );
    }else if(this.state.status && this.state.status == 'success'){
      return (
        <div>No Groups found.</div>
      )
    }else{
      return <Loader timeout={500}/>
    }
  }
});
