import React, {PropTypes} from 'react';
import {Toolbar} from '../global';
import UserInputs from '../user/UserInputs.jsx';
import {OnboardStore} from '../../stores';

export default React.createClass({
  mixins: [Store.mixin],
  storeDidChange(){
    const status = Store.getStatus();
    this.setState({status})
    if(status.success){
      router.transitionTo('env');
    }else{
    }
  },
  getInitialState(){
    return {
      user:Store.getUser(),
      status:OnboardStore.getStatus()
    }
  },
  updateUserData(data){
    this.setState({
      data:data
    })
  },
  disabled(){
    return !(this.state.data.name && this.state.data.email);
  },
  btnText(){
    return this.state.status.pending ? 'Logging In...' : 'Log In';
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
                <button type="submit" className="btn btn-success btn-raised btn-block" disabled={this.disabled()}>
                  {this.loginBtnText()}
                  {
                  // <img ng-show="state == options.inProgress" src="/public/img/tailspin_icon.svg" className="status_icon tailspin" alt="loading icon"/>
                  }
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
