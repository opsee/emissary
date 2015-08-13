import React, {PropTypes} from 'react';
import Toolbar from '../global/Toolbar.jsx';
import UserInputs from '../user/UserInputs.jsx';
import OnboardStore from '../../stores/Onboard';
import UserStore from '../../stores/User';
import router from '../../router.jsx';


export default React.createClass({
  mixins: [UserStore.mixin, OnboardStore.mixin],
  storeDidChange(){
    const status = OnboardStore.getSignupCreateStatus();
    this.setState({status})
    if(status.success){
      router.transitionTo('onboardThanks');
    }
  },
  getInitialState(){
    return {
      user:UserStore.getUser().toJS(),
      status:OnboardStore.getSignupCreateStatus()
    }
  },
  updateUserData(data){
    this.setState({
      user:data
    })
  },
  disabled(){
    return !(this.state.user.name && this.state.user.email);
  },
  btnText(){
    return this.state.status.pending ? 'Creating...' : 'Create Account';
  },
  render() {
    return (
      <div>
        <Toolbar title="Create Your Account"/>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-10 col-sm-offset-1">
              <form name="signupForm" ng-submit="submit()" user-signup novalidate>
                <UserInputs include={["name","email"]} onChange={this.updateUserData}/>
                <button type="submit" className="btn btn-success btn-raised btn-block" disabled={this.disabled()}>
                  {this.btnText()}
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
