import React, {PropTypes} from 'react';
import {Button} from '../../modules/bootstrap';
import {RadialGraph} from '../global';
import {Toolbar} from '../global';
import GroupItem from '../groups/GroupItem.jsx';
import {GroupStore} from '../../stores';
import {GroupActions} from '../../actions';

function getState(){
  return {
    groups: GroupStore.getGroups()
  }
}
export default React.createClass({
  mixins: [GroupStore.mixin],
  storeDidChange() {
    this.setState(getState());
  },
  componentWillMount(){
    GroupActions.getGroups();
  },
  getInitialState(){
    return getState();
  },
  render() {
    if(this.state.groups.size){
      return (
        <ul className="list-unstyled">
          {this.state.groups.map((group, i) => {
            return (
              <li key={i}>
                <GroupItem item={group}/>
              </li>
              )
          })}
        </ul>
      );
    }else{
      return (
        <div>No Groups found.</div>
      )
    }
  }
});
