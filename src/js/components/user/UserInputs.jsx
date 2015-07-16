import React from 'react';
import RadialGraph from '../global/RadialGraph.jsx';
import Actions from '../../actions/CheckActions';
import Store from '../../stores/CheckStore';
import Link from 'react-router/lib/components/Link';

function getState(){
  return {
    checks: Store.getChecks()
  }
}

export default React.createClass({
  getInitialState() {
    return {
      on:false
    }
  },
  silence(id){
    Actions.silence(id);
  },
  handleClick() {
    this.setState({
      on:!this.state.on
    })
  },
  render() {
    return (
      <div>
        <div className="form-group display-flex flex-wrap" ng-if="display('email');">
          <input id="userEmail" name="userEmail" type="text" ng-model="user.account.email" placeholder="email@domain.com" className="form-control has-icon flex-order-1" ng-required="true" ng-pattern="regex.email"/>
          <label for="userEmail">
            <span className="form-label">Email</span>
            <default-messages ng-model="form.userEmail"></default-messages>
          </label>
          <svg className="input-icon" viewBox="0 0 24 24">
            {
              //<use xlink:href="#ico_mail" />
            }
          </svg>
        </div>
        <div className="form-group display-flex flex-wrap" ng-if="display('name');">
          <input id="userFullName" name="userFullName" type="text" ng-model="user.bio.name" placeholder="First Last" className="form-control has-icon flex-order-1" ng-required="true" ng-pattern="regex.general"/>
          <label for="userFullName">
            <span className="form-label">Name</span>
            <default-messages ng-model="form.userFullName"></default-messages>
          </label>
          <svg className="input-icon" viewBox="0 0 24 24">
            {
              //<use xlink:href="#ico_person" />
            }
          </svg>
        </div>
        <div className="form-group display-flex flex-wrap" ng-if="display('password');">
          <input id="userPassword" type="password" name="userPassword" ng-model="user.account.password" placeholder="Password" className="form-control has-icon flex-order-1" ng-required="true"/>
          <label for="userPassword">
            <span className="form-label">Password</span>
            <default-messages ng-model="form.userPassword"></default-messages>
          </label>
          <svg className="input-icon" viewBox="0 0 24 24">
            {
              //<use xlink:href="#ico_lock" />
            }
          </svg>
        </div>
      </div>
    );
  }
});