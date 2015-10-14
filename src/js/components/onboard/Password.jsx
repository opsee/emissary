import React, {PropTypes} from 'react';
import {Toolbar} from '../global';
import UserInputs from '../user/UserInputs.jsx';
import {OnboardStore} from '../../stores';
import {OnboardActions} from '../../actions';
import {UserStore} from '../../stores';
import {State} from 'react-router';
import {Link} from 'react-router';
import {Grid, Row, Col} from '../../modules/bootstrap';
import router from '../../modules/router';
import {Button} from '../forms';


export default React.createClass({
  mixins: [State, OnboardStore.mixin],
  storeDidChange(){
    const status = OnboardStore.getOnboardSetPasswordStatus();
    let error;
    if(status == 'success'){
      router.transitionTo('tutorial');
      error = false;
    }else if(status && status != 'pending'){
      error = status;
    }
    this.setState({
      status,
      error
    });
  },
  getInitialState(){
    return {
      status:null,
      token:this.props.query.token,
      id:this.props.query.id,
      password:null,
      error:null
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
    if(!this.state.error){
      return (
         <div>
          <Toolbar title="Set Your Password"/>
          <Grid>
            <Row>
              <Col xs={12}>
                <form name="loginForm" onSubmit={this.submit}>
                  <UserInputs include={['password']}  onChange={this.updateUserData} email={this.state.password}/>
                  <div className="padding-t">
                    <Button type="submit" block={true} bsStyle="success" disabled={this.disabled()}>{this.btnText()}</Button>
                  </div>
                  <div className="padding-t">
                    <Link to="passwordForgot" className="btn btn-default btn-flat">Forgot Password?</Link>
                  </div>
                </form>
              </Col>
            </Row>
          </Grid>
        </div>
      );
    }else{
      return (
        <StatusHandler status={this.state.status}/>
      )
    }
  }
});
