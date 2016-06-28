import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router';
import _ from 'lodash';

import {Toolbar, LogoColor, StatusHandler} from '../global';
import UserInputs from '../user/UserInputs.jsx';
import {Col, Grid, Padding, Row} from '../layout';
import {Button} from '../forms';
import {user as actions} from '../../actions';

const OnboardCreate = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      signupCreate: PropTypes.func
    }),
    redux: PropTypes.shape({
      user: PropTypes.object,
      asyncActions: PropTypes.shape({
        userSignupCreate: PropTypes.object
      })
    }),
    location: PropTypes.shape({
      query: PropTypes.object
    }).isRequired
  },
  getInitialState(){
    return {
      data: this.props.redux.user.get('loginData'),
      validationError: undefined
    };
  },
  getButtonText(){
    return this.getStatus() === 'pending' ? 'Creating...' : 'Create Account';
  },
  getStatus(){
    return this.props.redux.asyncActions.userSignupCreate.status;
  },
  isDisabled(){
    const incomplete = !this.state.data.email;
    return incomplete || this.getStatus() === 'pending';
  },
  handleUserData(data){
    return this.setState({data});
  },
  handleSubmit(e){
    e.preventDefault();
    return this.props.actions.signupCreate(_.defaults(this.state.data, {
      name: 'default',
      referrer: this.props.location.query.referrer || ''
    }), '/');
  },
  render() {
    return (
       <div>
        <Toolbar title="Sign up for Our Public Beta"/>
        <Grid>
          <Row>
            <Col xs={12}>
              <Padding b={2}><LogoColor/></Padding>
              <p>Try Opsee <strong>for free</strong> in our public beta!</p>
              <form name="onboardForm" onSubmit={this.handleSubmit}>
                <Padding b={1}>
                  <UserInputs include={['email', 'name', 'password']} data={this.state.data} onChange={this.handleUserData}/>
                </Padding>
                <StatusHandler status={this.getStatus()}/>
                <div className="form-group">
                  <Button type="submit" color="success" block disabled={this.isDisabled()}>
                    {this.getButtonText()}
                  </Button>
                  <Padding t={1}>
                    <p className="text-sm text-secondary">By proceeding to create your Opsee account, you are agreeing to Opsee&rsquo;s <Link to="https://opsee.com/beta-tos" target="_blank">Terms of Service</Link> and <Link to="https://opsee.com/privacy" target="_blank">Privacy Policy</Link>.</p>
                  </Padding>
                </div>

                <Padding tb={1}>
                  <div>Already have an account? <Link to="/login">Log in</Link>.</div>
                </Padding>
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

export default connect(mapStateToProps, mapDispatchToProps)(OnboardCreate);