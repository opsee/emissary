import React, {PropTypes} from 'react';
import {Button} from '../../modules/bootstrap';
import {RadialGraph} from '../global';
import {Toolbar} from '../global';
import InstanceItem from '../instances/InstanceItem.jsx';
import {InstanceStore} from '../../stores';
import {InstanceActions} from '../../actions';

function getState(){
  return {
    instances: InstanceStore.getInstancesECC()
  }
}
export default React.createClass({
  mixins: [InstanceStore.mixin],
  storeDidChange() {
    this.setState(getState());
    const status = InstanceStore.getGetInstancesECCStatus();
    if(status == 'success'){
      this.setState({
        instances:InstanceStore.getInstancesECC()
      })
    }
  },
  componentWillMount(){
    InstanceActions.getInstancesECC();
  },
  getInitialState(){
    return getState();
  },
  render() {
    if(this.state.instances.size){
      return (
        <div>
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
