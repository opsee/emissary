import React, {PropTypes} from 'react';
import Toolbar from '../global/Toolbar.jsx';
import UserInputs from '../user/UserInputs.jsx';
import UserStore from '../../stores/User';
import UserActions from '../../actions/User';
import router from '../../router.jsx';
import Link from 'react-router/lib/components/Link';

export default React.createClass({
  mixins: [UserStore.mixin],
  storeDidChange(){
    const status = UserStore.getUserSendResetEmailStatus();
    this.setState({status})
    if(status == 'success'){
      // router.transitionTo('onboardThanks');
    }
  },
  getInitialState(){
    return {
      data:UserStore.getUser().toJS(),
      status:UserStore.getUserSendResetEmailStatus()
    }
  },
  updateUserData(data){
    this.setState({
      data:data
    })
  },
  submit(e){
    e.preventDefault();
    this.setState({
      submitting:true
    });
    UserActions.userSendResetEmail(this.state.data);
  },
  disabled(){
    return !this.state.data.email || this.state.status == 'pending';
  },
  btnText(){
    return this.state.status == 'pending' ? 'Sending...' : 'Send Reset Email';
  },
  render() {
    return (
       <div>
        <Toolbar title="Send Reset Email"/>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-10 col-sm-offset-1">
              <form name="loginForm" ng-submit="submit()" onSubmit={this.submit}>
                <UserInputs include={['email']}  onChange={this.updateUserData} email={this.state.data.email}/>
                <button type="submit" className="btn btn-raised btn-success btn-block ng-disabled" disabled={this.disabled()}>
                  <span>
                    {this.btnText()}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
