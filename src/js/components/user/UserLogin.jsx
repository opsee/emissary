import React from 'react';
import RadialGraph from '../global/RadialGraph.jsx';
import Actions from '../../actions/CheckActions';
import Store from '../../stores/CheckStore';
import Link from 'react-router/lib/components/Link';
import UserInputs from '../user/UserInputs.jsx';

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
      <form name="loginForm" ng-submit="submit()">
        <UserInputs include={["email","password"]}/>
        <button ng-disabled="state == options.inProgress || loginForm.$invalid || submitting" type="submit" className="btn btn-raised btn-success btn-block ng-disabled" disabled>
          <span ng-if="!submitting">Log In</span>
          <span ng-if="submitting">Logging In...</span>
        </button>
        <div className="clearfix"><br/></div>
        <div className="clearfix">
          <Link to="passwordForgot" className="btn btn-default btn-flat">Forgot Password?</Link>
          <Link to="start" className="btn btn-flat btn-info pull-right">Need an Account?</Link>
        </div>
      </form>
    );
  }
});