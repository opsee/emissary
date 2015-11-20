import React, {PropTypes} from 'react';
import {UserStore} from '../../stores';
import {UserActions, GlobalActions} from '../../actions';
import {Toolbar, LogoColor} from '../global';
import {Link} from 'react-router';
import UserInputs from '../user/UserInputs.jsx';
import _ from 'lodash';
import router from '../../modules/router';
import {Grid, Col, Row} from '../../modules/bootstrap';
import {Button} from '../forms';
import {Padding} from '../layout';

export default React.createClass({
  mixins: [UserStore.mixin],
  propTypes: {
    location: PropTypes.object
  },
  storeDidChange(){
    const status = UserStore.getUserLoginStatus();
    this.setState({status});
    if (status === 'success'){
      const redirect = UserStore.getUser().get('loginRedirect');
      if (redirect){
        router.transitionTo(redirect);
      }else {
        router.transitionTo('checks');
      }
    }else if (status && status !== 'pending'){
      GlobalActions.globalModalMessage({
        html: status.message || 'Something went wrong.',
        style: 'danger'
      });
    }
  },
  getInitialState(){
    return {
      data: UserStore.getUser(),
      status: UserStore.getUserLoginStatus()
    };
  },
  getButtonText(){
    return this.state.status === 'pending' ? 'Logging In...' : 'Log In';
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
    if (this.props.location.query.as){
      data.as = _.parseInt(this.props.location.query.as, 10);
    }
    UserActions.userLogin(data);
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
