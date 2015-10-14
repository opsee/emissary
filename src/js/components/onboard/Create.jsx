import React, {PropTypes} from 'react';
import {Toolbar, LogoColor} from '../global';
import UserInputs from '../user/UserInputs.jsx';
import {OnboardStore} from '../../stores';
import {OnboardActions, GlobalActions} from '../../actions';
import {UserStore} from '../../stores';
import router from '../../modules/router.js';
import {Link} from 'react-router';
import {Grid, Row, Col} from '../../modules/bootstrap';

export default React.createClass({
   mixins: [UserStore.mixin, OnboardStore.mixin],
  storeDidChange(){
    const status = OnboardStore.getOnboardSignupCreateStatus();
    this.setState({status})
    if(status == 'success'){
      router.transitionTo('onboardThanks');
    }else if(status && status != 'pending'){
      GlobalActions.globalModalMessage({
        html:status.body && status.body.message,
      });
    }
  },
  getInitialState(){
    return {
      data:UserStore.getUser().toJS(),
      status:OnboardStore.getOnboardSignupCreateStatus()
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
    OnboardActions.onboardSignupCreate(this.state.data);
  },
  disabled(){
    const incomplete = !(this.state.data.name && this.state.data.email);
    return incomplete || this.state.status == 'pending';
  },
  btnText(){
    return this.state.status == 'pending' ? 'Creating...' : 'Create Account';
  },
  render() {
    return (
       <div>
        <Toolbar title="Create Your Account"/>
        <Grid>
          <Row>
            <Col xs={12}>
              <LogoColor/>
              <form name="loginForm" ng-submit="submit()" onSubmit={this.submit}>
                <UserInputs include={['email', 'name']}  onChange={this.updateUserData} email={this.state.data.email} name={this.state.data.name}/>
                <div className="form-group">
                  <button type="submit" className="btn btn-raised btn-success btn-block ng-disabled" disabled={this.disabled()}>
                    <span>
                      {this.btnText()}
                    </span>
                  </button>
                </div>
                <div className="form-group">
                    <p><Link to="passwordForgot">Forgot your password?</Link></p>
                    <p>Already have an account? <Link to="login">Log in</Link>.</p>
                </div>
              </form>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});
