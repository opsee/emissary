import _ from 'lodash';
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import * as actions from '../../actions/user';
import {Alert, Col, Grid, Padding, Row} from '../layout';
import {Toolbar} from '../global';
import {Button} from '../forms';
import UserInputs from '../user/UserInputs.jsx';

const Verify = React.createClass({
  propTypes: {
    redux: PropTypes.shape({
      asyncActions: PropTypes.shape({
        userEdit: PropTypes.object,
        userVerifyEmail: PropTypes.object,
        userSendVerificationEmail: PropTypes.object
      })
    }),
    location: PropTypes.object,
    history: PropTypes.object.isRequired,
    actions: PropTypes.shape({
      userApply: PropTypes.func.isRequired,
      verifyEmail: PropTypes.func.isRequired,
      sendVerificationEmail: PropTypes.func.isRequired,
      edit: PropTypes.func.isRequired
    })
  },
  componentWillMount(){
    const token = this.props.location.query.token;
    if (!this.props.location.query.id || !token) {
      return this.props.history.replace('/login');
    }

    const loginDate = new Date();
    this.props.actions.userApply({ token, loginDate });
    this.props.actions.verifyEmail();
    return null;
  },
  getInitialState(){
    return {
      password: null
    };
  },
  getEditStatus(){
    return this.props.redux.asyncActions.userEdit.status;
  },
  getVerificationStatus(){
    return this.props.redux.asyncActions.userVerifyEmail.status;
  },
  getButtonText(){
    return this.getEditStatus() === 'pending' ? 'Setting password...' : 'Set password';
  },
  isDisabled(){
    return !this.state.password || this.getEditStatus() === 'pending';
  },
  onSubmit(e) {
    e.preventDefault();
    const data = _.assign(this.state, this.props.location.query);
    this.props.actions.edit(data, '/');
  },
  onInputChange(data) {
    this.setState(data);
  },
  onTriggerEmail(e) {
    e.preventDefault();
    const { id } = this.props.location.query;
    this.props.actions.sendVerificationEmail({ id });
  },
  renderAlert(){
    const hasEditError = this.getEditStatus() && typeof this.getEditStatus() !== 'string';
    const hasVerificationError = this.getVerificationStatus() && typeof this.getVerificationStatus() !== 'string';
    if (!hasEditError && !hasVerificationError) {
      return null;
    }
    let inner = '';
    if (hasVerificationError) {
      inner = ' verifying your email address';
    } else if (hasEditError) {
      inner = ' setting your password';
    }
    return (
      <Padding tb={1}>
        <Alert color="danger">
          <span>Uh oh, we're having some trouble{inner}. <a href="#" onClick={this.onTriggerEmail}>Click here</a> to resend the verification email.</span>
        </Alert>
      </Padding>
    );
  },
  render() {
    return (
      <div>
        <Toolbar title="Set a Password"/>
        <Grid>
          <Row>
            <Col xs={12}>
              <p>Welcome to Opsee! Thanks for verifying your email address.</p>
              <p>To finish setting up your account, choose a password. (You'll use this to log in to Opsee, along with your email address.)</p>
              <form onSubmit={this.onSubmit}>
                <UserInputs include={['password']} onChange={this.onInputChange} data={this.state}/>
                <Padding tb={1}>
                  <Button type="submit" color="success" block disabled={this.isDisabled()}>
                    {this.getButtonText()}
                  </Button>
                </Padding>
                {this.renderAlert()}
              </form>
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

export default connect(mapStateToProps, mapDispatchToProps)(Verify);