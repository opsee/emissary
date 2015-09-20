import React, {PropTypes} from 'react';
import {Button} from '../../modules/bootstrap';
import {RadialGraph} from '../global';
import {Toolbar, Loader} from '../global';
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
    if(this.isMounted()){
      this.setState(getState());
    }
  },
  componentDidMount(){
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
    }else if(this.state.status && this.state.status == 'success'){
      return (
        <div>No Instances found.</div>
      )
    }else{
      return <Loader timeout={500}/>
    }
  }
});
