import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router';

import {Toolbar, LogoColor, StatusHandler} from '../global';
import UserInputs from '../user/UserInputs.jsx';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Button} from '../forms';
import {Padding} from '../layout';
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
    })
  },
  getInitialState(){
    return {
      data: this.props.redux.user.get('loginData')
    };
  },
  getButtonText(){
    return this.getStatus() === 'pending' ? 'Creating...' : 'Create Account';
  },
  getStatus(){
    return this.props.redux.asyncActions.onboardSignupCreate.status;
  },
  isDisabled(){
    const incomplete = !this.state.data.email;
    return incomplete || this.getStatus() === 'pending';
  },
  handleUserData(data){
    this.setState({
      data: data
    });
  },
  handleSubmit(e){
    e.preventDefault();
    this.props.actions.signupCreate(this.state.data);
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
                  <UserInputs include={['email']}  onChange={this.handleUserData} email={this.state.data.email}/>
                </Padding>
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