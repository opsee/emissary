import React, {PropTypes} from 'react';
import Toolbar from '../global/Toolbar.jsx';
import UserInputs from '../user/UserInputs.jsx';
import UserStore from '../../stores/User';
import UserActions from '../../actions/User';
import router from '../../modules/router.js';
import Link from 'react-router/lib/components/Link';

export default React.createClass({
  mixins: [UserStore.mixin],
  storeDidChange(){
    const status = UserStore.getUserSendResetEmailStatus();
    this.setState({status});
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
    UserActions.userSendResetEmail(this.state.data);
  },
  disabled(){
    return !this.state.data.email || this.state.status == 'pending';
  },
  btnText(){
    return this.state.status == 'pending' ? 'Sending...' : 'Send Reset Email';
  },
  innerRender(){
    if(this.state.status == 'success'){
      return (
        <p>Success. Check your email.</p>
      )
    }else{
      return (
      <form name="loginForm" ng-submit="submit()" onSubmit={this.submit}>
        <p>Fill in your email and NEW password and you will be emailed for verification.</p>
        <UserInputs include={['email', 'password']}  onChange={this.updateUserData} email={this.state.data.email}/>
        <button type="submit" className="btn btn-raised btn-success btn-block ng-disabled" disabled={this.disabled()}>
          <span>
            {this.btnText()}
          </span>
        </button>
      </form>
      );
    }
  },
  render() {
    return (
       <div>
        <Toolbar title="Change Your Password"/>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-10 col-sm-offset-1">
              {this.innerRender()}
            </div>
          </div>
        </div>
      </div>
    );
  }
});
