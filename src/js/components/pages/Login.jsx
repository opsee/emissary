import React, {PropTypes} from 'react';
import Store from '../../stores/HomeStore';
import ActionCreator from '../../actions/Todo';
import Toolbar from '../global/Toolbar.jsx';
import UserLogin from '../user/UserLogin.jsx';

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
        <Toolbar title="Login to Your Account"/>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-10 col-sm-offset-1">
              <UserLogin/>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
