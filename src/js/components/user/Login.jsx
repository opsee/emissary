import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';

import {UserStore} from '../../stores';
import {UserActions, GlobalActions} from '../../actions';
import {Toolbar, LogoColor, StatusHandler} from '../global';
import {Link, History} from 'react-router';
import UserInputs from '../user/UserInputs.jsx';
import {Grid, Col, Row} from '../../modules/bootstrap';
import {Button} from '../forms';
import {Padding} from '../layout';
import * as actions from '../../reduxactions/user';

const Login = React.createClass({
  mixins: [UserStore.mixin, History],
  propTypes: {
    location: PropTypes.object
  },
  storeDidChange(){
    const status = UserStore.getUserLoginStatus();
    this.setState({status});
    if (status === 'success'){
      const next = _.get(this.props, 'location.state.redirect');
      if (next){
        return this.history.replaceState(null, next);
      }
      return this.history.pushState(null, '/');
    }
  },
  getInitialState(){
    return {
      data: UserStore.getUser(),
      status: UserStore.getUserLoginStatus()
    };
  },
  getButtonText(){
    return this.props.redux.asyncActions.userLogin.status === 'pending' ? 'Logging In...' : 'Log In';
  },
  isDisabled(){
    const incomplete = !(this.state.data.email && this.state.data.password);
    return incomplete || this.state.status === 'pending';
  },
  setUserData(data){
    this.setState({
      data: data
    });
  },
  handleSubmit(e){
    e.preventDefault();
    this.setState({
      submitting: true
    });
    let data = this.state.data;
    data.redirect = this.props.location.query.redirect;
    if (this.props.location.query.as){
      data.as = _.parseInt(this.props.location.query.as, 10);
    }
    this.props.actions.login(data);
    // UserActions.userLogin(data);
  },
  handleDismiss(){
    this.props.actions.userLoginDismissError();
  },
  render() {
    return (
       <div>
        <Toolbar title="Login to Your Account"/>
        <Grid>
          <Row>
            <Col xs={12}>
              <LogoColor/>
              <form name="loginForm" onSubmit={this.handleSubmit}>
                <UserInputs include={['email', 'password']}  onChange={this.setUserData}/>
                <StatusHandler status={this.props.redux.asyncActions.userLogin.status} onDismiss={this.handleDismiss}/>
                <Padding t={1}>
                  <Button type="submit" color="success" block disabled={this.isDisabled()}>
                    {this.getButtonText()}
                  </Button>
                </Padding>
                <Padding tb={2}>
                  <p><Link to="/password/forgot">Forgot your password?</Link></p>
                  <p>Need an account? <Link to="/start">Sign up!</Link></p>
                </Padding>
              </form>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

const mapDispatchToProps = (dispatch) => ({
  actions : bindActionCreators(actions, dispatch)
});

export default connect(null, mapDispatchToProps)(Login);