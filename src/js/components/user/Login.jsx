import React, {PropTypes} from 'react';
import {UserStore} from '../../stores';
import {UserActions, GlobalActions} from '../../actions';
import {Toolbar, LogoColor} from '../global';
import {Link} from 'react-router';
import UserInputs from '../user/UserInputs.jsx';
import _ from 'lodash';
import router from '../../modules/router';
import {Opsee} from '../icons';
import {Button, Grid, Col, Row} from '../../modules/bootstrap';

export default React.createClass({
  mixins: [UserStore.mixin],
  storeDidChange(){
    const status = UserStore.getUserLoginStatus();
    this.setState({status})
    if(status == 'success'){
      const redirect = UserStore.getUser().get('loginRedirect');
      if(redirect){
        router.transitionTo(redirect);
      }else{
        router.transitionTo('env');
      }
    }else if(status && status != 'pending'){
      GlobalActions.globalModalMessage({
        html:status.message || 'Something went wrong.',
        style:'danger'
      })
    }
  },
  getInitialState(){
    return {
      data:UserStore.getUser(),
      status:UserStore.getUserLoginStatus()
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
    let data = this.state.data;
    if(this.props.query.as){
      data.as = _.parseInt(this.props.query.as, 10);
    }
    UserActions.userLogin(data);
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
        <Grid>
          <Row>
            <Col xs={12}>
              <LogoColor/>
              <form name="loginForm" ng-submit="submit()" onSubmit={this.submit}>
                <UserInputs include={["email","password"]}  onChange={this.updateUserData}/>
                <div className="padding-t">
                  <Button type="submit" className="btn-raised" color="success" block={true} disabled={this.disabled()}>
                      {this.loginBtnText()}
                  </Button>
                </div>
                <div className="padding-t-md">
                    <p><Link to="passwordForgot">Forgot your password?</Link></p>
                    <p>Need an account? <Link to="start">Sign up!</Link></p>
                </div>
              </form>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});
