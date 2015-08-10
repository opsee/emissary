import React, {PropTypes} from 'react';
import Button from 'react-bootstrap/lib/Button';
import Jumbotron from 'react-bootstrap/lib/Jumbotron';
import TaskList from '../TaskList.jsx';
import RadialGraph from '../global/RadialGraph.jsx';
import Store from '../../stores/HomeStore';
import Toolbar from '../global/Toolbar.jsx';
import InstanceItem from '../instances/InstanceItem.jsx';
import InstanceStore from '../../stores/InstanceStore';
import InstanceActions from '../../actions/InstanceActions';

function getState(){
  return {
    instances: InstanceStore.getInstances()
  }
}
export default React.createClass({
  mixins: [InstanceStore.mixin],
  storeDidChange() {
    this.setState(getState());
  },
  componentWillMount(){
    InstanceActions.getInstances();
  },
  getInitialState(){
    return getState();
  },
  render() {
    return (
      <ul className="list-unstyled">
        {this.state.instances.map(i => {
          return (
            <li>
              <InstanceItem item={i}/>
            </li>
            )
        })}
      </ul>
    );
  }
});
