import React, {PropTypes} from 'react';
import {Toolbar} from '../global';
import UserInputs from '../user/UserInputs.jsx';
import {OnboardStore} from '../../stores';
import {OnboardActions} from '../../actions';
import {State} from 'react-router';
import {Grid, Row, Col} from '../../modules/bootstrap';
import router from '../../modules/router';
import {Button} from '../forms';
import {Padding} from '../layout';
import {StatusHandler} from '../global';

export default React.createClass({
  mixins: [State, OnboardStore.mixin],
  propTypes: {
    query: PropTypes.object
  },
  storeDidChange(){
    const status = OnboardStore.getOnboardSetPasswordStatus();
    let error;
    if (status === 'success'){
      router.transitionTo('tutorial');
      error = false;
    }else if (status && status !== 'pending'){
      error = status;
    }
    this.setState({
      status,
      error
    });
  },
  getInitialState(){
    return {
      status: null,
      token: this.props.query.token,
      id: this.props.query.id,
      password: null,
      error: null
    };
  },
  getButtonText(){
    return this.state.status === 'pending' ? 'Setting...' : 'Set';
  },
  isDisabled(){
    return !this.state.password || this.state.status === 'pending';
  },
  handleUserData(data){
    this.setState({password: data.password});
  },
  handleSubmit(e){
    e.preventDefault();
    this.setState({
      submitting: true
    });
    OnboardActions.onboardSetPassword(this.state);
  },
  render() {
    if (!this.state.error){
      return (
         <div>
          <Toolbar title="Set Your Password"/>
          <Grid>
            <Row>
              <Col xs={12}>
                <form name="loginForm" onSubmit={this.handleSubmit}>
                  <UserInputs include={['password']}  onChange={this.handleUserData} email={this.state.password}/>
                  <Padding t={1}>
                    <Button type="submit" block color="success" chevron disabled={this.isDisabled()}>{this.getButtonText()}</Button>
                  </Padding>
                </form>
              </Col>
            </Row>
          </Grid>
        </div>
      );
    }
    return (
      <StatusHandler status={this.state.status}/>
    );
  }
});
