import React, {PropTypes} from 'react';
import {Alert, Button} from '../../modules/bootstrap';
import {RadialGraph} from '../global';
import {Toolbar, StatusHandler} from '../global';
import InstanceItem from '../instances/InstanceItem.jsx';
import {InstanceStore} from '../../stores';
import {InstanceActions} from '../../actions';

function getState(){
  return {
    instances: InstanceStore.getInstancesECC(),
    status:InstanceStore.getGetInstancesECCStatus()
  }
}

export default React.createClass({
  mixins: [InstanceStore.mixin],
  storeDidChange() {
    const state = getState();
    this.setState(state);
  },
  componentWillMount(){
    InstanceActions.getInstancesECC();
  },
  getInitialState(){
    return getState();
  },
  getFailingInstances(){
    return this.state.instances.filter(i => {
      return i.get('health') < 100;
    });
  },
  getPassingInstances(){
    return this.state.instances.filter(i => {
      return i.get('health') == 100;
    });
  },
  renderFailingInstances(){
    const instances = this.getFailingInstances();
    if(instances.size){
      return (
        <div>
          <h3>Failing Instances</h3>
            {instances.map((instance, i) => {
              return <InstanceItem item={instance}/>
            })}
        </div>
      )
    }
  },
  render() {
    if(this.state.instances.size){
      return (
        <div>
          {this.renderFailingInstances()}
          <h3>Passing Instances</h3>
          <ul className="list-unstyled">
            {this.getPassingInstances().map((instance, i) => {
              return <InstanceItem item={instance}/>
            })}
          </ul>
        </div>
    );
    }else{
      return (
        <StatusHandler status={this.state.status}>
          <Alert bsStyle="default">No instances found</Alert>
        </StatusHandler>
      );
    }
  }
});
