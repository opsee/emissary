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

const OnboardPassword = React.createClass({
  propTypes: {
    location: PropTypes.object,
    actions: PropTypes.shape({
      setPassword: PropTypes.func
    }),
    redux: PropTypes.shape({
      user: PropTypes.object,
      asyncActions: PropTypes.shape({
        userSetPassword: PropTypes.object
      })
    })
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
  render() {
    return (
       <div>
        <Toolbar title="Get Started"/>
        <Grid>
          <Row>
            <Col xs={12}>
              <p>Let's get started using Opsee. Enter your name and choose a password to continue.</p>
              <form name="loginForm" onSubmit={this.handleSubmit}>
                <UserInputs include={['name', 'password']} onChange={this.handleUserData} data={this.state}/>
                <StatusHandler status={this.getStatus()}/>
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
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(null, mapDispatchToProps)(OnboardPassword);