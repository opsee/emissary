import React from 'react';
import {History} from 'react-router';
import {Toolbar, LogoColor} from '../global';
import UserInputs from '../user/UserInputs.jsx';
import {OnboardStore} from '../../stores';
import {OnboardActions, GlobalActions} from '../../actions';
import {UserStore} from '../../stores';
import {Link} from 'react-router';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Button} from '../forms';
import {Padding} from '../layout';

export default React.createClass({
  mixins: [UserStore.mixin, OnboardStore.mixin, History],
  storeDidChange(){
    const status = OnboardStore.getOnboardSignupCreateStatus();
    this.setState({status});
    if (status === 'success'){
      this.history.pushState(null, '/start/thanks');
    }else if (status && status !== 'pending'){
      GlobalActions.globalModalMessage({
        html: status.body && status.body.message
      });
    }
  },
  getInitialState(){
    return {
      data: UserStore.getUser().toJS(),
      status: OnboardStore.getOnboardSignupCreateStatus()
    };
  },
  getButtonText(){
    return this.state.status === 'pending' ? 'Creating...' : 'Create Account';
  },
  isDisabled(){
    const incomplete = !(this.state.data.name && this.state.data.email);
    return incomplete || this.state.status === 'pending';
  },
  handleUserData(data){
    this.setState({
      data: data
    });
  },
  handleSubmit(e){
    e.preventDefault();
    this.setState({
      submitting: true
    });
    OnboardActions.onboardSignupCreate(this.state.data);
  },
  render() {
    return (
       <div>
        <Toolbar title="Create Your Account"/>
        <Grid>
          <Row>
            <Col xs={12}>
              <LogoColor/>
              <form name="loginForm" onSubmit={this.handleSubmit}>
                <UserInputs include={['email', 'name']}  onChange={this.handleUserData} email={this.state.data.email} name={this.state.data.name}/>
                <div className="form-group">
                  <Button type="submit" color="success" block disabled={this.isDisabled()}>
                    {this.getButtonText()}
                  </Button>
                </div>
                <Padding t={4}>
                  <div><Link to="/password-forgot">Forgot your password?</Link></div>
                  <div>Already have an account? <Link to="/login">Log in</Link>.</div>
                </Padding>
              </form>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});
