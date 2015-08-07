import React, {PropTypes} from 'react';
import Store from '../../stores/HomeStore';
import Toolbar from '../global/Toolbar.jsx';
import UserInputs from '../user/UserInputs.jsx';

function getState(){
  return {
    instances: Store.getInstances(),
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
      <div>
        Page not found.
      </div>
    );
  }
});
