import React, {PropTypes} from 'react';
import Button from 'react-bootstrap/lib/Button';
import Jumbotron from 'react-bootstrap/lib/Jumbotron';
import RadialGraph from '../global/RadialGraph.jsx';
import Store from '../../stores/Home';
import Toolbar from '../global/Toolbar.jsx';
import InstanceItem from '../instances/InstanceItem.jsx';
import InstanceStore from '../../stores/Instance';
import InstanceActions from '../../actions/Instance';

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
    if(this.state.instances.size){
      return (
        <div>
        <DocumentTitle title="Home - Instances"/>
          <ul className="list-unstyled">
            {this.state.instances.map((instance, i) => {
              return (
                <li key={i}>
                  <InstanceItem item={instance}/>
                </li>
                )
            })}
          </ul>
        </div>
    );
    }else{
      return (
        <div>No Instances found.</div>
      )
    }
  }
});
