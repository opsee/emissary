import React, {PropTypes} from 'react';
import Store from '../../stores/Home';
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
      <form name="passwordForgotForm" ng-submit="submit()" className="container">
        <div className="col-xs-12">
          <h1>Forgot Password</h1>
          <UserInputs include={["email"]}/>
          <button ng-disabled="passwordForgotForm.$invalid" type="submit" className="btn btn-raised btn-success btn-block">Send Reset Email</button>
          <div><br/></div>
          {
            //<div ng-if="msg">{{msg}}</div>
          }
        </div>
      </form>
    );
  }
});
