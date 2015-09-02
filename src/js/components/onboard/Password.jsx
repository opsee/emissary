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


export default React.createClass({
  mixins: [State, OnboardStore.mixin],
  storeDidChange(){
    const status = OnboardStore.getSetPasswordStatus();
    this.setState({status})
    if(status == 'success'){
      router.transitionTo('tutorial');
    }else{
      console.error(status);
    }
  },
  getInitialState(){
    return {
      status:null,
      token:this.props.query.token,
      id:this.props.query.id,
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
