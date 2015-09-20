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
    }else if(this.state.status && this.state.status == 'success'){
      return (
        <div>No Groups found.</div>
      )
    }else{
      return <Loader timeout={500}/>
    }
  }
});
