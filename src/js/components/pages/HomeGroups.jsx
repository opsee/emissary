import React, {PropTypes} from 'react';
import Button from 'react-bootstrap/lib/Button';
import Jumbotron from 'react-bootstrap/lib/Jumbotron';
import TaskList from '../TaskList.jsx';
import RadialGraph from '../global/RadialGraph.jsx';
import Store from '../../stores/HomeStore';
import Toolbar from '../global/Toolbar.jsx';
import InstanceItem from '../instances/InstanceItem.jsx';
import GroupItem from '../groups/GroupItem.jsx';

function getState(){
  return {
    groups: Store.getGroups()
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
  render() {
    return (
      <ul className="list-unstyled">
        {this.props.groups.map(i => {
          return (
            <li>
              <GroupItem {...i}/>
            </li>
            )
        })}
      </ul>
    );
  }
});
