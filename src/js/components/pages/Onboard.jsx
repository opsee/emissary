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
        <Toolbar title="Create Your Account"/>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-10 col-sm-offset-1">
              <form name="signupForm" ng-submit="submit()" user-signup novalidate>
                <UserInputs include={["name","email"]}/>
                <button ng-disabled="state == options.inProgress || signupForm.$invalid" type="submit" className="btn btn-success btn-raised btn-block" disabled="disabled">
                  {
                  //<span>{{state}}</span>
                  }
                  <img ng-show="state == options.inProgress" src="/public/img/tailspin_icon.svg" className="status_icon tailspin" alt="loading icon"/>
                </button>
              </form>
              <div className="padding-tb">
                <div><br/></div>
                <a className="btn btn-flat btn-default" href="/login">Need to Login?</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
