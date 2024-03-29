import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';
import {Link} from 'react-router';

import {Toolbar, LogoColor, StatusHandler} from '../global';
import UserInputs from '../user/UserInputs.jsx';
import {Col, Grid, Padding, Panel, Row} from '../layout';
import {Heading} from '../type';
import {Button} from '../forms';
import {user as actions} from '../../actions';

const Login = React.createClass({
  propTypes: {
    location: PropTypes.object,
    redux: PropTypes.object.isRequired,
    actions: PropTypes.shape({
      login: PropTypes.func,
      setLoginData: PropTypes.func
    }).isRequired,
    scheme: PropTypes.string
  },
  getInitialState(){
    return {
      data: this.props.redux.user.toJS()
    };
  },
  getButtonText(){
    return this.props.redux.asyncActions.userLogin.status === 'pending' ? 'Logging In...' : 'Log In';
  },
  isDisabled(){
    const incomplete = !(this.state.data.email && this.state.data.password);
    return incomplete || this.props.redux.asyncActions.userLogin.status === 'pending';
  },
  setUserData(d){
    //just a nice little helper that strips whitespace
    const data = _.mapValues(d, (value, key) => key === 'email' && _.trim(value) || value);
    this.setState({data});
    this.props.actions.setLoginData(data);
  },
  handleSubmit(e){
    e.preventDefault();
    let data = this.state.data;
    if (this.props.location.query.as){
      data.as = _.parseInt(this.props.location.query.as, 10);
    }
    this.props.actions.login(data);
  },
  render() {
    return (
       <div>
        <Toolbar title="Log In to Your Account" hidden />
        <Grid>
          <Row className="center-xs">
            <Col xs={12} sm={8}>
              <Padding t={4} b={2}>
                <Panel scheme={this.props.scheme}>
                  <Padding t={2} b={1} className="text-center">
                    <LogoColor borderColor="light" />
                    <Heading level={2}>Log In to Your Account</Heading>
                  </Padding>
                  <form onSubmit={this.handleSubmit} className="text-left">
                    <UserInputs include={['email', 'password']} onChange={this.setUserData} data={this.state.data}/>
                    <StatusHandler status={this.props.redux.asyncActions.userLogin.status}/>
                    <Padding t={1}>
                      <Button type="submit" color="success" block disabled={this.isDisabled()}>
                        {this.getButtonText()}
                      </Button>
                    </Padding>
                    <Padding tb={2} className="text-center">
                      <p><Link to="/password-forgot">Forgot your password?</Link></p>
                      <p>Need an account? <Link to="/start">Sign up!</Link></p>
                    </Padding>
                  </form>
                </Panel>
              </Padding>
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

export default connect(null, mapDispatchToProps)(Login);