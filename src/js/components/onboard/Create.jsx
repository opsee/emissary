import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router';
import _ from 'lodash';

import {Toolbar, LogoColor, StatusHandler} from '../global';
import UserInputs from '../user/UserInputs.jsx';
import {Col, Grid, Padding, Row} from '../layout';
import {Button} from '../forms';
import {onboard as actions} from '../../actions';

const OnboardCreate = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      signupCreate: PropTypes.func
    }),
    redux: PropTypes.shape({
      user: PropTypes.object,
      asyncActions: PropTypes.shape({
        onboardSignupCreate: PropTypes.object
      })
    }),
    location: PropTypes.shape({
      query: PropTypes.object
    }).isRequired
  },
  getInitialState(){
    return {
      data: this.props.redux.user.get('loginData'),
      tos: false,
      validationError: undefined
    };
  },
  getButtonText(){
    return this.getStatus() === 'pending' ? 'Creating...' : 'Create Account';
  },
  getStatus(){
    return this.props.redux.asyncActions.onboardSignupCreate.status;
  },
  isDisabled(){
    const incomplete = !this.state.data.email || !this.state.tos;
    return incomplete || this.getStatus() === 'pending';
  },
  handleUserData(data){
    return this.setState({data});
  },
  handleInputChange(e){
    if (e && e.target){
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      let state = {
        [e.target.name]: value
      };
      if (e.target.name === 'tos' && value){
        state.validationError = undefined;
      }
      this.setState(state);
    }
  },
  handleSubmit(e){
    e.preventDefault();
    if (!this.state.tos){
      return this.setState({
        validationError: 'You must accept the Terms of Service below.'
      });
    }
    return this.props.actions.signupCreate(_.defaults(this.state.data, {
      name: 'default',
      referrer: this.props.location.query.referrer || ''
    }));
  },
  render() {
    return (
       <div>
        <Toolbar title="Sign up for Our Private Beta"/>
        <Grid>
          <Row>
            <Col xs={12}>
              <Padding b={2}><LogoColor/></Padding>
              <p>Try Opsee <strong>for free</strong> in our private beta. If you <a target="_blank" href="https://opsee.typeform.com/to/JHiTKr">fill out our survey</a> and you're a good fit, we'll <em>bump you to the top of the list</em>.</p>
              <form name="onboardForm" onSubmit={this.handleSubmit}>
                <Padding b={1}>
                  <UserInputs include={['email']} data={this.state.data} onChange={this.handleUserData}/>
                </Padding>
                <div className="display-flex">
                  <Padding r={1} b={1}>
                    <input id="js-tos" name="tos" value={this.state.tos} type="checkbox" onChange={this.handleInputChange} required/>
                  </Padding>
                  <label className="label" htmlFor="js-tos">I accept the <Link to="/tos" target="_blank">Opsee Terms of Service</Link></label>
                </div>
                <StatusHandler status={this.getStatus()}/>
                <div className="form-group">
                  <Button type="submit" color="success" block disabled={this.isDisabled()}>
                    {this.getButtonText()}
                  </Button>
                </div>
                <Padding t={4}>
                  <div><Link to="/password-forgot">Forgot your password?</Link></div>
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

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(null, mapDispatchToProps)(OnboardCreate);