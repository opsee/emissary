import React, {PropTypes} from 'react';
import Toolbar from '../global/Toolbar.jsx';
import UserInputs from '../user/UserInputs.jsx';
import OnboardStore from '../../stores/Onboard';
import OnboardActions from '../../actions/Onboard';
import UserStore from '../../stores/User';
import {State} from 'react-router';
import Link from 'react-router/lib/components/Link';
import {Grid, Row, Col} from '../../modules/bootstrap';


export default React.createClass({
  mixins: [State],
  storeDidChange(){
    const status = OnboardStore.getSetPasswordStatus();
    this.setState({status})
    if(status == 'success'){
      router.transitionTo('onboardThanks');
    }
  },
  getInitialState(){
    return {
      status:null,
      email:this.getQuery().email,
      token:this.getQuery().token,
      password:null
    }
  },
  updateUserData(data){
    this.setState({password:data.password})
  },
  submit(e){
    e.preventDefault();
    this.setState({
      submitting:true
    });
    OnboardActions.onboardSetPassword(this.state);
  },
  disabled(){
    return !this.state.password || this.state.status == 'pending';
  },
  btnText(){
    return this.state.status == 'pending' ? 'Setting...' : 'Set';
  },
  render() {
    return (
       <div>
        <Toolbar title="Set Your Password"/>
        <Grid>
          <Row>
            <Col xs={12} sm={10} smOffset={1}>
              <form name="loginForm" ng-submit="submit()" onSubmit={this.submit}>
                <UserInputs include={['password']}  onChange={this.updateUserData} email={this.state.password}/>
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
