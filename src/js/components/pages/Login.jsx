import React, {PropTypes} from 'react';
import Store from '../../stores/User';
import Actions from '../../actions/User';
import Toolbar from '../global/Toolbar.jsx';
import Link from 'react-router/lib/components/Link';
import UserInputs from '../user/UserInputs.jsx';
import _ from 'lodash';
import router from '../../router.jsx';

export default React.createClass({
  mixins: [Store.mixin],
  storeDidChange(){
    const status = Store.getStatus();
    this.setState({status})
    if(status == 'success'){
      router.transitionTo('home');
    }else{
    }
  },
  getInitialState(){
    return {
      data:Store.getUser(),
      status:Store.getStatus()
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
    Actions.userLogin(this.state.data);
  },
  disabled(){
    const incomplete = !(this.state.data.email && this.state.data.password);
    return incomplete || this.state.status == 'pending';
  },
  loginBtnText(){
    return this.state.status == 'pending' ? 'Logging In...' : 'Log In';
  },
  render() {
    return (
       <div>
        <Toolbar title="Login to Your Account"/>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-10 col-sm-offset-1">
              <form name="loginForm" ng-submit="submit()" onSubmit={this.submit}>
                <UserInputs include={["email","password"]}  onChange={this.updateUserData}/>
                <button type="submit" className="btn btn-raised btn-success btn-block ng-disabled" disabled={this.disabled()}>
                  <span>
                    {this.loginBtnText()}
                  </span>
                </button>
                <div className="clearfix"><br/></div>
                <div className="clearfix">
                  <Link to="passwordForgot" className="btn btn-default btn-flat">Forgot Password?</Link>
                  <Link to="start" className="btn btn-flat btn-info pull-right">Need an Account?</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
