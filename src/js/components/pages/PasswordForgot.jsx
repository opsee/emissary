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
      <form name="passwordForgotForm" ng-submit="submit()" className="container">
        <div className="col-xs-12">
          <h1>Forgot Password</h1>
          <div className="form-group">
            <input type="email" ng-model="user.account.email" placeholder="Email" className="form-control has-icon" ng-required="true" ng-pattern="regex.email" />
            <svg className="input-icon" viewBox="0 0 24 24">
              {
                //<use xlink:href="#ico_mail" />
              }
            </svg>
            <label>Email</label>
            <span className="input-error-text small">is not valid</span>
          </div>
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
