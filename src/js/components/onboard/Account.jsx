import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Checkmark} from '../icons';
import UserInputs from '../user/UserInputs.jsx';
import {Button} from '../forms';
import {Col, Grid, Padding, Row} from '../layout';
import {StatusHandler} from '../global';
import {user as actions} from '../../actions';
import style from './onboard.css';

const OnboardAccount = React.createClass({
  propTypes: {
    location: PropTypes.object,
    actions: PropTypes.shape({
      setPassword: PropTypes.func
    }),
    history: PropTypes.shape({
      pushState: PropTypes.func
    }),
    redux: PropTypes.shape({
      user: PropTypes.object,
      asyncActions: PropTypes.shape({
        userSetPassword: PropTypes.object
      })
    })
  },
  contextTypes: {
    router: PropTypes.object.isRequired
  },
  componentWillReceiveProps(nextProps){
    const wasPending = this.getStatus() === 'pending';
    const isDone = nextProps.redux.asyncActions.userSetPassword.status === 'success';
    if (wasPending && isDone) {
      setTimeout(() => {
        this.context.router.push('/');
      }, 500);
    }
  },
  getInitialState(){
    return {
      password: undefined,
      name: undefined
    };
  },
  getButtonText(){
    return this.getStatus() === 'pending' ? 'Setting...' : 'Set';
  },
  getStatus(){
    return this.props.redux.asyncActions.userSetPassword.status;
  },
  isDisabled(){
    return (!this.state.password || !this.state.name) || this.getStatus() === 'pending';
  },
  handleUserData(data){
    this.setState(data);
  },
  handleSubmit(e){
    e.preventDefault();
    const data = _.chain({}).assign(this.state, this.props.location.query).pick(['id', 'token', 'password', 'name']).value();
    this.props.actions.setPassword(data);
  },
  renderSubmitButton(){
    let text;
    let chevron = true;
    const status = this.getStatus();
    if (status === 'pending') {
      text = 'Saving...';
    } else if (status === 'success') {
      chevron = false;
      text = <Checkmark btn />;
    } else {
      text = 'Save';
    }
    const disabled = this.isDisabled();
    return (
      <Button type="submit" block color="primary" chevron={chevron} disabled={disabled}>{text}</Button>
    );
  },
  renderForm(){
    return (
      <div>
        <Padding t={4} b={2} className="text-center">
          <h2>Welcome to Opsee!</h2>
        </Padding>
        <p>Let's get started. Enter your name and choose a password to continue.</p>
        <form name="loginForm" onSubmit={this.handleSubmit}>
          <UserInputs include={['name', 'password']} onChange={this.handleUserData} data={this.state}/>
          <StatusHandler status={this.getStatus()}/>
          <Padding t={1}>
            {this.renderSubmitButton()}
          </Padding>
        </form>
      </div>
    );
  },
  render() {
    return (
      <div className={style.transitionPanel}>
        <Grid>
          <Row>
            <Col xs={12}>
              {this.renderForm()}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

const mapStateToProps = (state) => ({
  redux: state
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(OnboardAccount);