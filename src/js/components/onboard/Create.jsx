import React, {PropTypes} from 'react';
import {Toolbar} from '../global';
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
            <Col xs={12} sm={10} smOffset={1}>
              <form name="loginForm" ng-submit="submit()" onSubmit={this.submit}>
                <UserInputs include={['email', 'name']}  onChange={this.updateUserData} email={this.state.data.email} name={this.state.data.name}/>
                <button type="submit" className="btn btn-raised btn-success btn-block ng-disabled" disabled={this.disabled()}>
                  <span>
                    {this.btnText()}
                  </span>
                </button>
                <div className="clearfix"><br/></div>
                <div className="clearfix">
                  <Link to="passwordForgot" className="btn btn-default btn-flat">Forgot Password?</Link>
                </div>
              </form>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});
