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
      refresh: PropTypes.func.isRequired,
      verifyEmail: PropTypes.func.isRequired,
      sendVerificationEmail: PropTypes.func.isRequired,
      edit: PropTypes.func.isRequired
    })
  },
  componentWillMount(){
    const id = _.get(this.props.location.query, 'id');
    const verificationToken = _.get(this.props.location.query, 'verification_token');
    const authToken = _.get(this.props.location.query, 'token');

    if (!id || !authToken || !verificationToken) {
      return this.props.history.replace('/login');
    }

    // Apply the partially authenticated user locally
    const loginDate = new Date();
    this.props.actions.userApply({ id, loginDate, token: authToken });

    // Grab the rest of the user data
    this.props.actions.refresh();

    // Verify the email address right away, no click required
    this.props.actions.verifyEmail({ id, verificationToken, authToken });
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
    const id = _.get(this.props.location.query, 'id');
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

    let status = this.props.redux.asyncActions.userSendVerificationEmail.status;
    let statusMessage = null;
    if (status === 'pending') {
      statusMessage = 'Sending...';
    } else if (status === 'success') {
      statusMessage = 'Verification email sent!';
    }

    return (
      <Padding tb={1}>
        <Alert color="danger">
          <div>Uh oh, we're having some trouble{inner}. <a href="#" onClick={this.onTriggerEmail}>Click here</a> if you need to resend the verification email.</div>
          {statusMessage ?
            <Padding t={1}>{statusMessage}</Padding>
          : null }
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