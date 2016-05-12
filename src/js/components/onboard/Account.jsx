import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Toolbar} from '../global';
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
  componentWillReceiveProps(nextProps){
    const wasPending = this.getStatus() === 'pending';
    const isDone = nextProps.redux.asyncActions.userSetPassword.status === 'success';
    if (wasPending && isDone) {
      setTimeout(() => {
        history.pushState(null, '/start/launch-stack')
      }, 2000);
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
  renderForm(){
    return (
      <div>
        <p>Let's get started using Opsee. Enter your name and choose a password to continue.</p>
        <form name="loginForm" onSubmit={this.handleSubmit}>
          <UserInputs include={['name', 'password']} onChange={this.handleUserData} data={this.state}/>
          <StatusHandler status={this.getStatus()}/>
          <Padding t={1}>
            <Button type="submit" block color="success" chevron disabled={this.isDisabled()}>{this.getButtonText()}</Button>
          </Padding>
        </form>
      </div>
    );
  },
  renderSuccess(){
    return (
      <div>
        <p>Great you're done</p>
        <Padding tb={2}>
          <Button to="/start/review-stack" color="success" block chevron>Next</Button>
        </Padding>
      </div>
    );
  },
  render() {
    return (
      <div className={style.transitionPanel}>
        <Grid>
          <Row>
            <Col xs={12}>
              {this.getStatus() === 'success' ? this.renderSuccess() : this.renderForm()}
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