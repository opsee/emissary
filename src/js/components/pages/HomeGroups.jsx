import React, {PropTypes} from 'react';
import Button from 'react-bootstrap/lib/Button';
import Jumbotron from 'react-bootstrap/lib/Jumbotron';
import TaskList from '../TaskList.jsx';
import RadialGraph from '../global/RadialGraph.jsx';
import Store from '../../stores/HomeStore';
import Toolbar from '../global/Toolbar.jsx';
import GroupItem from '../groups/GroupItem.jsx';
import GroupStore from '../../stores/GroupStore';
import GroupActions from '../../actions/Group';

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
    return (
      <ul className="list-unstyled">
        {this.state.groups.map(i => {
          return (
            <li>
              <GroupItem item={i}/>
            </li>
            )
        })}
      </ul>
    );
  }
});
