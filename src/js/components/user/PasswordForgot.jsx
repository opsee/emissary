import React, {PropTypes} from 'react';
import {Toolbar} from '../global';
import UserInputs from '../user/UserInputs.jsx';
import {UserStore} from '../../stores';
import {UserActions} from '../../actions';
import router from '../../modules/router.js';
import {Link} from 'react-router';

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
        <p>Simply fill in your email and we&rsquo;ll message you with a shiny reset link.</p>
        <UserInputs include={['email']}  onChange={this.updateUserData} email={this.state.data.email}/>
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
