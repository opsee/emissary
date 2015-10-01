import React, {PropTypes} from 'react';
import {UserStore} from '../../stores';
import {UserActions, GlobalActions} from '../../actions';
import {Toolbar} from '../global';
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
      router.transitionTo('env');
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
    UserActions.userLogin(this.state.data);
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
            <Col xs={12} sm={10} smOffset={1}>
              <form name="loginForm" ng-submit="submit()" onSubmit={this.submit}>
                <UserInputs include={["email","password"]}  onChange={this.updateUserData}/>
                <Button type="submit" className="btn-raised" bsStyle="success" block={true} disabled={this.disabled()}>
                    {this.loginBtnText()}
                </Button>
                <div className="padding-t-md">
                    <Link to="passwordForgot" className="btn btn-default btn-flat btn-nopad">Forgot Password?</Link>
                    <Link to="start" className="btn btn-flat btn-primary btn-nopad pull-right">Signup</Link>
                </div>
              </form>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});
